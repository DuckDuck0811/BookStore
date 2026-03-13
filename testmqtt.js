import { check, sleep } from 'k6';
import mqtt from 'k6/x/mqtt';

export const options = {
    vus: 1,
    duration: '10s',
};

export default function () {
    const client = mqtt.connect({
        broker: 'tcp://broker.hivemq.com:1883', // test public broker
        clientId: `k6-client-${__VU}-${__ITER}`,
        username: '',
        password: '',
        keepAlive: 60,
        cleanSession: true,
    });

    check(client, {
        'MQTT connected': (c) => c !== null,
    });

    client.publish(
        'test/vms',
        JSON.stringify({
            msg: 'hello from k6 mqtt',
            vu: __VU,
            time: new Date().toISOString(),
        }),
        { qos: 0, retain: false }
    );

    sleep(1);

    client.disconnect();
}
