export const Ages = [
  {_id: 0, title: 'Under 18'},
  {_id: 1, title: '18-24'},
  {_id: 2, title: '25-34'},
  {_id: 3, title: '35-44'},
  {_id: 4, title: '45-54'},
  {_id: 5, title: '55+'},
];

export const Genders = [
  {_id: 0, title: 'Female'},
  {_id: 1, title: 'Male'},
  {_id: 2, title: 'Non-Binary'},
  {_id: 3, title: 'Other'},
];

export const TabButtons = [
  {_id: 0, title: 'home', icon: require('@assets/images/home.png')},
  {_id: 1, title: 'search', icon: require('@assets/images/search.png')},
  {_id: 2, title: 'add', icon: require('@assets/images/add.png')},
  {_id: 3, title: 'chat', icon: require('@assets/images/chat.png')},
  {_id: 4, title: 'profile', icon: require('@assets/images/profile.png')},
];

export const tabs = ['Photo', 'Video', 'About', 'Favorite'];

export const months = [
  'Jan',
  'Feb',
  'Mar',
  'Apr',
  'May',
  'Jun',
  'Jul',
  'Aug',
  'Sep',
  'Oct',
  'Nov',
  'Dec',
];

export const customUser = {
  id: '1',
  email: 'user@email.com',
  displayName: 'user',
  photoURL: require('@assets/images/user.png'),
  providerId: 'g.com',
  age: '18',
  gender: 'Male',
  fcmToken: 'werr',
  following: [],
  followers: [],
  bio: `Professional photographer and digital artist. Capturing moments and
          creating memories. Based in New York City 📍`,
  dob: '01/01/2001',
  work: 'Photo',
  education: 'B.tech',
  hometown: 'India',
};
