// //src/data/contact.ts
// export const contact = {
//   whatsapp: {
//     number: '94762360948',
//     message: 'Hi Sanjeevan, can we discuss about a project?',
//   },
//   email: {
//     address: 'yogaratnamsanjeevan@gmail.com',
//     subject: 'Project Inquiry from Portfolio',
//     body: 'Hi Sanjeevan,\n\nCan we discuss about a project?\n',
//   },
//   social: {
//     github: 'https://github.com/Sanjeevan23',
//     linkedin: 'https://www.linkedin.com/in/sanjeevan-yogaratnam-5942b12a5?utm_source=share&utm_campaign=share_via&utm_content=profile&utm_medium=ios_app',
//   },
// };




// src/data/contact.ts
export const contact = {
  whatsapp: {
    number: '94762360948', // raw international (no +)
    message: 'Hi Sanjeevan, can we discuss about a project?',
  },
  phone: {
    // human-friendly and tel link
    pretty: '+94 76 236 0948',
    tel: 'tel:+94762360948',
  },
  email: {
    address: 'yogaratnamsanjeevan@gmail.com',
    subject: 'Project Inquiry from Portfolio',
    body: 'Hi Sanjeevan,\n\nCan we discuss about a project?\n',
    mailto() {
      return `mailto:${this.address}?subject=${encodeURIComponent(this.subject)}&body=${encodeURIComponent(this.body)}`;
    },
  },
  social: {
    github: 'https://github.com/Sanjeevan23',
    linkedin:
      'https://www.linkedin.com/in/sanjeevan-yogaratnam-5942b12a5?utm_source=share&utm_campaign=share_via&utm_content=profile&utm_medium=ios_app',
    facebook: 'https://www.facebook.com/Sanjeevan.Yogaratnam',
    instagram: 'https://www.instagram.com/sanjeevan23',
    // whatsapp link helper
    whatsappLink() {
      return `https://wa.me/${this.whatsappNumber ?? '94762360948'}`;
    },
    // helper values
    whatsappNumber: '94762360948',
  },
};