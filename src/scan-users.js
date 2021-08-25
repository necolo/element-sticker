const postgres = require('postgres');
const sql = postgres();
const { setSticker } = require('./matrix-api');

const stickerUrl = process.env.STICKER_URL;

exports.scanUser = async function () {
  console.log('scanning users...');
  const tokens = await sql `
    SELECT
      DISTINCT ON (user_id) user_id, token
    FROM
      access_tokens
    WHERE
      user_id NOT IN (
        SELECT
          user_id
        FROM
          account_data
        WHERE
          account_data_type = 'm.widgets'
          AND
          content like ${`%${stickerUrl}%`}
        )
    ORDER BY
      user_id
    `;
  console.log(`${tokens.length} user(s) need to add sticker widget`);
  for (const { user_id, token } of tokens) {
    console.log('adding sticker widget for user ' + user_id);
    const data = JSON.stringify(getStickerData(user_id));
    await setSticker(user_id, token, data);
  }
  console.log('DONE!');
};

function getStickerData(sender) {
  return {
    stickerpicker: {
        content: {
            type: 'm.stickerpicker',
            url: `${stickerUrl}?theme=$theme`,
            name: 'Stickerpicker',
            data: {},
        },
        sender,
        state_key: 'stickerpicker',
        type: 'm.widget',
        id: 'stickerpicker',
    },
  };
}
