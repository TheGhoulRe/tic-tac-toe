import axios from 'axios';

export default function ServerConnection( baseUrl) {

    this.getFrom = async (dir, callback = (res) => {} ) => {
        let res = (await axios.get(baseUrl + dir)).data;
        callback(res);
        return res;
    };

    this.postDataTo = async (dir, data) => {
        let res = await axios.post(baseUrl + dir, data);
        return res;
    };

}

function RecurringServerConnection(baseUrl, delay) {
    const server = new ServerConnection(baseUrl);
    let timer = null;

    this.getFrom = (dir, callback=(res) => {} ) => {
        timer = setInterval(() => {server.getFrom(dir, callback);}, delay);
    };
    this.stop = () => {
        clearInterval(timer);
        timer = null;
    };
}

export {RecurringServerConnection};