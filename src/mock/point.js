// import dayjs from 'dayjs';
import {TYPES, FAKE_NAMES} from '../consts';
import {getRandomInteger} from '../utils/mock-utils';


const FAKE_DESCRIPTIONS = `Lorem ipsum dolor sit amet, consectetur adipiscing elit. Cras aliquet varius magna,
non porta ligula feugiat eget. Fusce tristique felis at fermentum pharetra.
Aliquam id orci ut lectus varius viverra. Nullam nunc ex, convallis sed finibus eget,
sollicitudin eget ante. Phasellus eros mauris, condimentum sed nibh vitae,
sodales efficitur ipsum. Sed blandit, eros vel aliquam faucibus, purus ex euismod diam,
eu luctus nunc ante ut dui. Sed sed nisi sed augue convallis suscipit in sed felis.
Aliquam erat volutpat. Nunc fermentum tortor ac porta dapibus. In rutrum ac purus sit amet tempus.`.split('.');

const FAKE_PICTURE_URL = 'http://picsum.photos/248/152?r=';
const VALUE_OF_DESTINATIONS = FAKE_NAMES.length;
const VALUE_OF_OFFERS = TYPES.length;

const FakeValue = {
  MAX_OFFERS: 5,
  MIN_PRICE: 10,
  MAX_PRICE: 1000,
  MAX_SENTENCES: 5,
  MAX_PICTURES: 6,
  MAX_DAYS_GAP: 7,
  MAX_HOURS_GAP: 24,
  MAX_MINUTES_GAP: 60,
  MIN_DIFF_MINUTES: 10,
  MAX_DIFF_MINUTES: 1600,
};

// const UnitValue = {
//   DAY: 'day',
//   MINUTE: 'minute',
//   HOUR: 'hour',
// };


const getFakeOffer = () => {
  const titles = FAKE_DESCRIPTIONS[getRandomInteger(0, FAKE_DESCRIPTIONS.length - 1)].split(' ');
  const titleString = titles.slice(getRandomInteger(0, titles.length - 1)).join(' ');

  const title = titleString ? titleString : null;
  const price = title ? getRandomInteger(FakeValue.MIN_PRICE, FakeValue.MAX_PRICE) : null;
  const id = getRandomInteger(getRandomInteger(1, 10000));

  if (title === null) {
    return null;
  }

  return ({
    title,
    price,
    id
  });
};

const getRandomOffers = () => {
  const offers = {};

  const getOffersArr = () => {
    const offersArr = [];
    const valueOfOffers = getRandomInteger(0, FakeValue.MAX_OFFERS);

    for (let i = 0; i < valueOfOffers; i++) {
      const offer = getFakeOffer();

      if (offer) {
        offersArr.push(offer);
      }
    }

    return offersArr;
  };

  for (const type of TYPES) {
    offers[type] = getOffersArr();
  }
  return offers;
};

const getRandomOffer = (type) => {
  const offers = getRandomOffers();
  return offers[type];
};


const getRandomDescription = () => {
  let description = '';
  const valueOfSentences = getRandomInteger(0, FakeValue.MAX_SENTENCES);

  for (let i = 0; i < valueOfSentences; i++) {
    description += FAKE_DESCRIPTIONS[getRandomInteger(0, FAKE_DESCRIPTIONS.length - 1)];
  }

  return description;
};

const getRandomPictures = () => {
  const pictures = [];
  const valueOfPictures= getRandomInteger(0, FakeValue.MAX_PICTURES);

  for (let i = 0; i < valueOfPictures; i++) {
    const picture = {
      src: `${FAKE_PICTURE_URL}${i}`,
      description: FAKE_DESCRIPTIONS[i],
    };
    pictures.push(picture);
  }

  return pictures;
};

// const getRandomDate = () => {
//   const daysGap = getRandomInteger(FakeValue.MAX_DAYS_GAP, -FakeValue.MAX_DAYS_GAP);
//   const hoursGap = getRandomInteger(FakeValue.MAX_HOURS_GAP, -FakeValue.MAX_HOURS_GAP);
//   const minutesGap = getRandomInteger(FakeValue.MAX_MINUTES_GAP, -FakeValue.MAX_MINUTES_GAP);
//
//   const dateFrom = dayjs().add(daysGap, UnitValue.DAY).add(hoursGap, UnitValue.HOUR).add(minutesGap, UnitValue.MINUTE);
//
//   const diffBetweenDays = getRandomInteger(FakeValue.MIN_DIFF_MINUTES, FakeValue.MAX_DIFF_MINUTES);
//
//   const dateTo = dateFrom.add(diffBetweenDays, UnitValue.MINUTE);
//
//   return {
//     dateFrom: dateFrom.toDate(),
//     dateTo: dateTo.toDate(),
//   };
// };


const getDestinations = (value) => {
  const destinationsList = [];

  for (let i = 0; i < value; i++) {
    destinationsList.push({
      name: FAKE_NAMES[i],
      description: getRandomDescription(),
      pictures: getRandomPictures(),
    });
  }
  return destinationsList;
};
export const destinationsData = getDestinations(VALUE_OF_DESTINATIONS);


const getOffers = (value) => {
  const offers = [];

  for (let i = 0; i < value; i++) {
    offers.push({
      type: TYPES[i],
      offers: getRandomOffer(TYPES[i]),
    });
  }
  return offers;
};
export const offersData = getOffers(VALUE_OF_OFFERS);


// export const getPoint = () => {
//   const typeValue = TYPES[getRandomInteger(0, TYPES.length - 1)];
//   const city = FAKE_NAMES[getRandomInteger(0, FAKE_NAMES.length - 1)];
//
//   const {dateTo, dateFrom} = getRandomDate();
//
//   const [destinationData] = destinationsData.filter(({name}) => name === city);
//   const [offerData] = offersData.filter(({type}) => type === typeValue);
//
//
//   return ({
//     price: getRandomInteger(FakeValue.MIN_PRICE, FakeValue.MAX_PRICE),
//     dateFrom,
//     dateTo,
//     destination: {
//       description: destinationData.description,
//       name: destinationData.name,
//       pictures: destinationData.pictures,
//     },
//     isFavorite: Boolean(getRandomInteger(0, 1)),
//     offers: offerData.offers,
//     type: typeValue,
//     id: getRandomInteger(1, 10000),
//   });
// };


