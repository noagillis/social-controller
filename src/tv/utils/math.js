function secondsToTime(secs, i18n) {
  var hours = Math.floor(secs / (60 * 60));

  var divisor_for_minutes = secs % (60 * 60);
  var minutes = Math.floor(divisor_for_minutes / 60);

  var divisor_for_seconds = divisor_for_minutes % 60;
  var seconds = Math.ceil(divisor_for_seconds);

  var obj = {
    h: hours,
    m: minutes === 0 ? 12 : minutes,
    s: seconds,
  };

  var string =
    obj.h > 0
      ? `${obj.h}${i18n['label_h']} ${obj.m}${i18n['label_m']}`
      : `${obj.m}${i18n['label_m']}`;

  return string;
}

function removeWord(sentence, wordsToRemove) {
  // Create a regular expression pattern to match words to remove
  const pattern = new RegExp('\\b(' + wordsToRemove?.join('|') + ')\\b', 'gi');

  // Replace the matched words with an empty string
  const filteredSentence = sentence?.replace(pattern, '');

  return filteredSentence.trim();
}

function getImgFocalPoint(artworkObj, isRowOpen) {
  const _x = artworkObj?.focalPoint?.x ?? 0.5;
  // const _y = artworkObj?.focalPoint?.y ?? 0.5;

  const _focalpoint_x = Math.min(0.85, Math.max(0.15, _x));
  // const _focalpoint_y =
  //   rowType === 'M' ? Math.min(0.63, Math.max(0.4, _y)) : 0.5;

  const _offset_x = isRowOpen ? 0 : (0.5 - _focalpoint_x) * 100;

  // const yOffset = -50 + (0.5 - _focalpoint_y) * 100;

  let _transform = `translate(${-50 + _offset_x}%, -50%)`;

  return _transform;
}

function filterValuesByLength(obj, length) {
  const shortChips = [];
  const longChips = [];

  for (const key in obj) {
    if (Object.hasOwnProperty.call(obj, key)) {
      const value = obj[key];

      if (value.text.length < length[0]) {
        shortChips.push(value);
      } else if (value.text.length < length[1]) {
        longChips.push(value);
      }
    }
  }

  return shortChips.length > 1
    ? shortChips.slice(0, 2)
    : longChips.length > 0
    ? longChips.slice(0, 1)
    : shortChips.length > 0
    ? shortChips.slice(0, 1)
    : null;
}

function removeTop10(obj) {
  const { topten, ...rest } = obj;
  return rest;
}

function trimSentence(sentence, maxLength = 10) {
  if (sentence.length > maxLength) {
    return sentence.substring(0, maxLength) + '...';
  }
  return sentence;
}

function validateData(data, requiredProperties) {
  // Check if each property in requiredProperties exists in the data object
  return requiredProperties.every((prop) => prop in data);
}

function generateRandomGameHandle() {
  const adjectives = [
    'Swift',
    'Mighty',
    'Stealthy',
    'Furious',
    'Clever',
    'Brave',
    'Epic',
    'Silent',
    'Shadow',
    'Thunder',
  ];
  const nouns = [
    'Warrior',
    'Ninja',
    'Samurai',
    'Wizard',
    'Rogue',
    'Knight',
    'Hunter',
    'Ranger',
    'Titan',
    'Guardian',
  ];
  const numbers = Math.floor(Math.random() * 1000); // Generate a random number between 0 and 999

  const randomAdjective =
    adjectives[Math.floor(Math.random() * adjectives.length)];
  const randomNoun = nouns[Math.floor(Math.random() * nouns.length)];

  return `${randomAdjective}${randomNoun}${numbers}`;
}

export {
  secondsToTime,
  removeWord,
  getImgFocalPoint,
  filterValuesByLength,
  removeTop10,
  trimSentence,
  validateData,
  generateRandomGameHandle,
};
