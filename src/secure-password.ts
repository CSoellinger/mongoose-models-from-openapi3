// import * as securePassword from 'secure-password';

// // Initialise our password policy
// const pwd = securePassword();

// const userPassword = Buffer.from('my secret password')

// // Register user
// pwd.hash(userPassword, (err: any, hash: any) => {
//   if (err) throw err

//   console.log('hhhash', hash.toString());
//   // Save hash somewhere
//   pwd.verify(userPassword, hash, (errVerify: any, result: any) => {
//     if (errVerify) throw errVerify

//     if (result === securePassword.INVALID_UNRECOGNIZED_HASH) return console.error('This hash was not made with secure-password. Attempt legacy algorithm')
//     if (result === securePassword.INVALID) return console.log('Imma call the cops')
//     if (result === securePassword.VALID) return console.log('Yay you made it')
//     if (result === securePassword.VALID_NEEDS_REHASH) {
//       console.log('Yay you made it, wait for us to improve your safety')

//       pwd.hash(userPassword, (errHash: any, improvedHash: any) => {
//         if (errHash) console.error('You are authenticated, but we could not improve your safety this time around')

//         // Save improvedHash somewhere
//         console.log('imprroooved hash', improvedHash);
//       })
//     }
//   })
// });
