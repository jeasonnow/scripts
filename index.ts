import Layer3Claimer from "utils/Layer3Claimer";
import fetch from 'node-fetch';

import config from './config';
import { IpResponse } from "types";


const run = async () => {
    // const ips = await fetch(config.dynamicIpsApi).then(async (res) => {
    //     const ipsJson = await res.json();
    //     const ips = (ipsJson as IpResponse).data;
    //     return ips;
    // });

    // console.log(ips);

    const ips = new Array(1).fill('http://127.0.0.1:7890');

    const claimer = new Layer3Claimer({ips});
    claimer.claim();
}

run();


