import moment from 'moment';
import { Auth } from 'aws-amplify';

export function debounce(func, wait, immediate) {
  let timeout;
  return function () {
    const context = this;
    const args = arguments;
    clearTimeout(timeout);
    timeout = setTimeout(() => {
      timeout = null;
      if (!immediate) func.apply(context, args);
    }, wait);
    if (immediate && !timeout) func.apply(context, args);
  };
}

export function isMobile() {
  if (window) {
    return window.matchMedia('(max-width: 767px)').matches;
  }
  return false;
}

export function isMdScreen() {
  if (window) {
    return window.matchMedia('(max-width: 1199px)').matches;
  }
  return false;
}

function currentYPosition() {
  if (!window) {
    return;
  }
  // Firefox, Chrome, Opera, Safari
  if (window.pageYOffset) return window.pageYOffset;
  // Internet Explorer 6 - standards mode
  if (document.documentElement && document.documentElement.scrollTop) return document.documentElement.scrollTop;
  // Internet Explorer 6, 7 and 8
  if (document.body.scrollTop) return document.body.scrollTop;
  return 0;
}

function elmYPosition(elm) {
  let y = elm.offsetTop;
  let node = elm;
  while (node.offsetParent && node.offsetParent !== document.body) {
    node = node.offsetParent;
    y += node.offsetTop;
  }
  return y;
}

export function scrollTo(scrollableElement, elmID) {
  const elm = document.getElementById(elmID);
  if (!elmID || !elm) {
    return;
  }
  const startY = currentYPosition();
  const stopY = elmYPosition(elm);
  const distance = stopY > startY ? stopY - startY : startY - stopY;
  if (distance < 100) {
    scrollTo(0, stopY);
    return;
  }
  let speed = Math.round(distance / 50);
  if (speed >= 20) speed = 20;
  const step = Math.round(distance / 25);
  let leapY = stopY > startY ? startY + step : startY - step;
  let timer = 0;
  if (stopY > startY) {
    for (let i = startY; i < stopY; i += step) {
      setTimeout(
        (function (leapY) {
          return () => {
            scrollableElement.scrollTo(0, leapY);
          };
        }(leapY)),
        timer * speed,
      );
      leapY += step;
      if (leapY > stopY) leapY = stopY;
      timer++;
    }
    return;
  }
  for (let i = startY; i > stopY; i -= step) {
    setTimeout(
      (function (leapY) {
        return () => {
          scrollableElement.scrollTo(0, leapY);
        };
      }(leapY)),
      timer * speed,
    );
    leapY -= step;
    if (leapY < stopY) leapY = stopY;
    timer++;
  }
  return false;
}

export function getTimeDifference(date) {
  const difference = moment(new Date(), 'DD/MM/YYYY HH:mm:ss').diff(
    moment(date, 'DD/MM/YYYY HH:mm:ss'),
  ) / 1000;

  if (difference < 60) return `${Math.floor(difference)} seconds`;
  if (difference < 3600) return `${Math.floor(difference / 60)} minutes`;
  if (difference < 86400) return `${Math.floor(difference / 3660)} hours`;
  if (difference < 86400 * 30) return `${Math.floor(difference / 86400)} days`;
  if (difference < 86400 * 30 * 12) return `${Math.floor(difference / 86400 / 30)} months`;
  return `${(difference / 86400 / 30 / 12).toFixed(1)} years`;
}

export function generateRandomId() {
  const tempId = Math.random().toString();
  const uid = tempId.substr(2, tempId.length - 1);
  return uid;
}

export function getQueryParam(prop) {
  const params = {};
  const search = decodeURIComponent(
    window.location.href.slice(window.location.href.indexOf('?') + 1),
  );
  const definitions = search.split('&');
  definitions.forEach((val, key) => {
    const parts = val.split('=', 2);
    params[parts[0]] = parts[1];
  });
  return prop && prop in params ? params[prop] : params;
}

export function classList(classes) {
  return Object.entries(classes)
    .filter((entry) => entry[1])
    .map((entry) => entry[0])
    .join(' ');
}

export const userIsLoggedIn = async () => {
  let username = '';
  // var email = ''
  try {
    const user = await Auth.currentAuthenticatedUser();
    username = user.username;
  } catch (err) {
    console.log('error getting user data... ', err);
    return false;
  }
  if (username !== '') {
    return true;
  }
  return false;
};
