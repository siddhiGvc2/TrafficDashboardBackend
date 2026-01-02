const jwt=require('jsonwebtoken');
const crypto=require('crypto');
const axios=require('axios');
const { trafficUsers  } =require('../../Models');
const { successResponse, errorResponse, uniqueId } =require('../../helpers');

 const allUsers = async (req, res) => {
  try {
    const page = req.params.page || 1;
    const limit = 2;
    const users = await trafficUsers.scope('withSecretColumns').findAndCountAll({
      order: [['createdAt', 'DESC'], ['firstName', 'ASC']],
      offset: (page - 1) * limit,
      limit,
    });
    return successResponse(req, res, { users });
  } catch (error) {
    return errorResponse(req, res, error.message);
  }
};
 const get = async (req, res) => {
  try {
    const users = await trafficUsers.scope('withSecretColumns').findAll();
    return successResponse(req, res, { users });
  } catch (error) {
    return errorResponse(req, res, error.message);
  }
};

 const register = async (req, res) => {
  try {
    const {
      email, password, firstName, lastName,
    } = req.body;
    if (process.env.IS_GOOGLE_AUTH_ENABLE === 'true') {
      if (!req.body.code) {
        throw new Error('code must be defined');
      }
      const { code } = req.body;
      const customUrl = `${process.env.GOOGLE_CAPTCHA_URL}?secret=${process.env.GOOGLE_CAPTCHA_SECRET_SERVER
        }&response=${code}`;
      const response = await axios({
        method: 'post',
        url: customUrl,
        data: {
          secret: process.env.GOOGLE_CAPTCHA_SECRET_SERVER,
          response: code,
        },
        config: { headers: { 'Content-Type': 'multipart/form-data' } },
      });
      if (!(response && response.data && response.data.success === true)) {
        throw new Error('Google captcha is not valid');
      }
    }

    const user = await trafficUsers.scope('withSecretColumns').findOne({
      where: { email },
    });
    if (user) {
      throw new Error('User already exists with same email');
    }
    const reqPass = crypto
      .createHash('md5')
      .update(password)
      .digest('hex');
    const payload = {
      email,
      firstName,
      lastName,
      password: reqPass,
      isVerified: false,
      verifyToken: uniqueId(),
    };

    const newUser = await trafficUsers.create(payload);
    return successResponse(req, res, {});
  } catch (error) {
    return errorResponse(req, res, error.message);
  }
};

const login = async (req, res) => {
  try {
  
    const user = await trafficUsers.scope('withSecretColumns').findOne({
      where: { email: req.body.email },
    });
    // console.log(user)
    if (!user) {
      throw new Error('Incorrect Email Id/Password');
    }
    const reqPass = crypto
      .createHash('sha256')
      .update(req.body.password || '')
      .digest('hex');
      // console.log("pass",reqPass);
      // console.log( user.password)
      // if (reqPass.toLowerCase() !== user.password.toLowerCase()) {

      //   throw new Error('Incorrect Email Id/Password');
      // }
    const token = jwt.sign(
      {
        user: {
          userId: user.id,
          email: user.email,
          createdAt: new Date(),
        },
      },
      process.env.SECRET,
    );
    delete user.dataValues.password;
    return successResponse(req, res, { user, token });
  } catch (error) {
    console.log(error);
    return errorResponse(req, res, error.message);
  }
};
 const tokenLogin = async (req, res) => {
  try {
    const user = await trafficUsers.scope('withSecretColumns').findOne({
      where: { verifyToken: req.query.token },
    });
    if (!user) {
      throw new Error('Incorrect Token');
    }
    const token = jwt.sign(
      {
        user: {
          userId: user.id,
          email: user.email,
          createdAt: new Date(),
        },
      },
      process.env.SECRET,
    );
    delete user.dataValues.password;
    return successResponse(req, res, { user, token });
  } catch (error) {
    return errorResponse(req, res, error.message);
  }
};
 const profile = async (req, res) => {
  try {
    const { userId } = req.user;
    const user = await trafficUsers.scope('withSecretColumns').findOne({ where: { id: userId } });
    return successResponse(req, res, { user });
  } catch (error) {
    return errorResponse(req, res, error.message);
  }
};

 const changePassword1 = async (req, res) => {
  try {
    const { userId } = req.user;
    const user = await trafficUsers.scope('withSecretColumns').findOne({
      where: { id: userId },
    });

    const reqPass = crypto
      .createHash('md5')
      .update(req.body.oldPassword)
      .digest('hex');
    if (reqPass !== user.password) {
      throw new Error('Old password is incorrect');
    }

    const newPass = crypto
      .createHash('md5')
      .update(req.body.newPassword)
      .digest('hex');

    await trafficUsers.update({ password: newPass }, { where: { id: user.id } });
    return successResponse(req, res, {});
  } catch (error) {
    return errorResponse(req, res, error.message);
  }
};

 const changeUserPassword = async (req, res) => {
  try {
    const { id } = req.body;
    const user = await trafficUsers.scope('withSecretColumns').findOne({
      where: { id: id },
    });

    const newPass = crypto
      .createHash('sha256')
      .update(req.body.password)
      .digest('hex');

    await trafficUsers.update({ password: newPass }, { where: { id: user.id } });
    return successResponse(req, res, {});
  } catch (error) {
    return errorResponse(req, res, error.message);
  }
};

 const saveUser = async (req, res) => {
  try {
    console.log(req.body);
    const {
      email, password, name, city, zone, ward, beat, isAdmin, clientName
    } = req.body;

    const user = await trafficUsers.scope('withSecretColumns').findOne({
      where: { email },
    });
    if (user) {
      throw new Error('User already exists with same username');
    }
    const reqPass = crypto
      .createHash('sha256')
      .update(password)
      .digest('hex');
    const payload = {
      email,
      name,
      City:city,
      zone,
      ward,
      beat,
      isAdmin,
      clientName,
      password: reqPass,
      isVerified: true,
    };
   console.log(payload);
    const newUser = await trafficUsers.create(payload);
    console.log(newUser)
    return successResponse(req, res, {});
  } catch (error) {
    console.log(error)
    return errorResponse(req, res, error.message);
  }
};

 const deleteUser = async (req, res) => {
  try {
    const user = await trafficUsers.scope('withSecretColumns').findOne({
      where: { id: req.query.id },
    });
    if (!user) {
      throw new Error(`User doesn't exist`);
    }

    await trafficUsers.destroy({ where: { id: req.query.id } });
    return successResponse(req, res, {});
  } catch (error) {
    return errorResponse(req, res, error.message);
  }
};


module.exports={allUsers,register,login,get,tokenLogin,saveUser,changePassword1,changeUserPassword,deleteUser,profile}