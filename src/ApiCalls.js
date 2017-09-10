import axios from 'axios';

const POST = (object, URL, func) => {
  axios.post(`${URL}`, object)
  .then((response) => {
    func(response, true);
  })
  .catch((error) => {
    func(error, false);
  });
};


export { POST };
