//                                     _                                               _ 
//                                    | |                                             | |
//     ___ _ __   ___ _ __ _   _ _ __ | |_   _ __   __ _ ___ _____      _____  _ __ __| |
//    / _ \ '_ \ / __| '__| | | | '_ \| __| | '_ \ / _` / __/ __\ \ /\ / / _ \| '__/ _` |
//   |  __/ | | | (__| |  | |_| | |_) | |_  | |_) | (_| \__ \__ \\ V  V / (_) | | | (_| |
//    \___|_| |_|\___|_|   \__, | .__/ \__| | .__/ \__,_|___/___/ \_/\_/ \___/|_|  \__,_|
//                          __/ | |         | |                                          
//                         |___/|_|         |_|                                          

const bcrypt      = require(`bcrypt`);
const bcryptSalt  = 10;
const salt        = bcrypt.genSaltSync(bcryptSalt);

exports.encryptPassword = (plaintextPassword) => {
  return bcrypt.hashSync(plaintextPassword, salt);
};

