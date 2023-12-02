const urlRegex = /^https?:\/\/(?:www\.)?[-a-zA-Z0-9@:%._+~#=]{1,256}\.[a-zA-Z0-9()]{1,6}\b(?:[-a-zA-Z0-9()@:%_+.~#?&/=]*)$/;
const emailRegex = /^\S+@\S+\.\S+$/;

module.exports = {
  urlRegex,
  emailRegex,
  LIKE_MESSAGE: 'Вы уже поставили лайк этой карточке.',
  DISLIKE_MESSAGE: 'Вы уже убрали лайк с карточки.',
};
