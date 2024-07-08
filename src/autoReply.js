const fs = require('fs');
const mime = require('mime-types');

const removeEmojis = (text) => {
    if (!text) {
        return '';
    }
    return text.replace(
        /([\u2700-\u27BF]|[\uE000-\uF8FF]|\uD83C[\uDC00-\uDFFF]|\uD83D[\uDC00-\uDFFF]|[\u2011-\u26FF]|\uD83E[\uDD10-\uDDFF])/g,
        ''
    );
}

const downloadMedia = (media) => {
    const mediaPath = './downloaded-media/';

    if (!fs.existsSync(mediaPath)) {
        fs.mkdirSync(mediaPath);
    }

    const extension = mime.extension(media.mimetype);
    const filename = new Date().getTime();
    const fullFilename = mediaPath + filename + '.' + extension;

    try {
        fs.writeFileSync(fullFilename, media.data, { encoding: 'base64' });
        console.log('File downloaded successfully!', fullFilename);
    } catch (err) {
        console.log('Failed to save the file:', err);
    }
};

const autoReply = (msg, client, db, myCache) => {
    let textt = msg.body;
    let phoneNumber = msg.from;
    let mynumber = phoneNumber.split("@")[0];

    console.log(phoneNumber.split("@")[1]);

    if (phoneNumber.split("@")[1] === "g.us") {
        mynumber = phoneNumber;
        console.log('masuk group');
    }

    let texte = textt.toLowerCase();
    texte = removeEmojis(texte);
    let startup = false;

    const value = myCache.get('startapp');
    if (value === 'hiputu') {
        startup = true;
        console.log('start up', startup);
    }

    if (texte === 'hiputu') {
        startup = true;
        console.log('start up');
        myCache.set('startapp', 'hiputu');
        msg.reply('Hiputu Aktif');
    }


    if (texte === '!groups') {
        client.getChats().then(chats => {
            const groups = chats.filter(chat => chat.isGroup);

            if (groups.length === 0) {
                msg.reply('You have no group yet.');
            } else {
                let replyMsg = '*YOUR GROUPS*\n\n';
                groups.forEach((group, i) => {
                    replyMsg += `ID: ${group.id._serialized}\nName: ${group.name}\n\n`;
                });
                replyMsg += '_You can use the group id to send a message to the group._'
                msg.reply(replyMsg);
            }
        });
    } else if (texte === 'good morning') {
        msg.reply('selamat pagi');
    } else if (texte === '!ping') {
        msg.reply('pong');
    }

    if (startup) {
        console.log('masuk start true', mynumber);
        db.query(
            `SELECT * FROM autoreply a LEFT JOIN group_kontak_d b ON a.group_id = b.kontak_id LEFT JOIN contact c ON b.kontak = c.id WHERE LOWER(keyword) = "${texte}" AND c.number = "${mynumber}"`,
            async (err, results) => {
                if (err) {
                    console.error(err);
                    return;
                }

                if (results.length === 0) {
                    const myArray = texte.split(' ');
                    db.query(
                        `SELECT * FROM autoreply a LEFT JOIN group_kontak_d b ON a.group_id = b.kontak_id LEFT JOIN contact c ON b.kontak = c.id WHERE LOWER(keyword) = "${myArray[0]}" AND c.number = "${mynumber}"`,
                        async (err01, results01) => {
                            if (err01) {
                                console.error(err01);
                                return;
                            }

                            if (results01.length === 0) {
                                return;
                            }

                            if (!results01[0].query) {
                                msg.reply(myArray[1]);
                            } else {
                                db.query(
                                    `SELECT * FROM query JOIN koneksi ON query.connection = koneksi.id WHERE query.id = "${results01[0].query}"`,
                                    async (err, results02) => {
                                        if (results02[0].koneksi === 'sdb8') {
                                            dbs = sdb8;
                                        } else if (results02[0].koneksi === 'sdb3') {
                                            dbs = sdb8;
                                        }

                                        const kondisis = results02[0].query.replace(
                                            'kondisi',
                                            'a.EmployeeNo=' + "'" + myArray[1] + "'"
                                        );

                                        dbs.query(kondisis, async (err1, results3) => {
                                            let nilai = '';
                                            let hasil = '';
                                            const html = results02[0].format;

                                            for (const prop in results3.recordset) {
                                                for (const prove in results3.recordset[prop]) {
                                                    nilai = prove;
                                                    hasil += results3.recordset[prop][prove] + '\r\n';
                                                }
                                            }

                                            let today = new Date();
                                            const option = { month: 'long' };
                                            const namaBulan = today.toLocaleString('id-ID', option);
                                            const dd = String(today.getDate()).padStart(2, '0');
                                            const mm = String(today.getMonth() + 1).padStart(2, '0');
                                            const yyyy = today.getFullYear();

                                            today = mm + '/' + dd + '/' + yyyy;
                                            const result = html.replace('[' + nilai + ']', hasil);
                                            const result2 = result.replace('Hari', today);
                                            const result3 = result2.replace('Bulan', namaBulan + '-' + yyyy);

                                            msg.reply(result3);
                                        });
                                    }
                                );
                            }
                        }
                    );
                } else {
                    if (results[0].query == null) {
                        msg.reply(results[0].response);
                    } else {
                        var dbs = '';
                        db.query(
                            `SELECT * FROM query JOIN koneksi ON query.connection = koneksi.id WHERE query.id = "${results[0].query}"`,
                            async (err, results2) => {
                                if (results2[0].koneksi === 'sdb8') {
                                    dbs = sdb8;
                                } else if (results2[0].koneksi === 'sdb3') {
                                    dbs = sdb8;
                                }

                                dbs.query(`${results2[0].query}`, async (err1, results3) => {
                                    let nilai = '';
                                    let hasil = '';
                                    const html = results2[0].format;

                                    for (const prop in results3.recordset) {
                                        for (const prove in results3.recordset[prop]) {
                                            nilai = prove;
                                            hasil += results3.recordset[prop][prove] + '\r\n';
                                        }
                                    }

                                    let today = new Date();
                                    const option = { month: 'long' };
                                    const namaBulan = today.toLocaleString('id-ID', option);
                                    const dd = String(today.getDate()).padStart(2, '0');
                                    const mm = String(today.getMonth() + 1).padStart(2, '0');
                                    const yyyy = today.getFullYear();

                                    today = mm + '/' + dd + '/' + yyyy;
                                    const result = html.replace('[' + nilai + ']', hasil);
                                    const result2 = result.replace('Hari', today);
                                    const result3 = result2.replace('Bulan', namaBulan + '-' + yyyy);

                                    msg.reply(result3);
                                });
                            }
                        );
                    }
                }
            }
        );
    }

    // NOTE: Uncomment the script below if you want to save the message media files
    if (msg.hasMedia) {
        msg.downloadMedia().then(media => {
            if (media) {
                downloadMedia(media);
            }
        });
    }
};

module.exports = autoReply;
