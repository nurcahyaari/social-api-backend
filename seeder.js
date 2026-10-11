const profileSchema = require('./models/user');

async function seederData() {
    await profileSchema.create(
        {
            "name": "A Martinez",
            "description": "Adolph Larrue Martinez III.",
            "mbti": "ISFJ",
            "enneagram": "9w3",
            "variant": "sp/so",
            "tritype": 725,
            "socionics": "SEE",
            "sloan": "RCOEN",
            "psyche": "FEVL",
            "image": "https://i.pinimg.com/736x/83/bc/8b/83bc8b88cf6bc4b4e04d153a418cde62.jpg",
        },
        {
            "name": "John Denver",
            "description": "Adolph Larrue Martinez III.",
            "mbti": "ISFJ",
            "enneagram": "9w3",
            "variant": "sp/so",
            "tritype": 725,
            "socionics": "SEE",
            "sloan": "RCOEN",
            "psyche": "FEVL",
            "image": "data:image/webp;base64,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",
        }
    );

    console.log("[Seeder] Data seeded successfully");
}

module.exports = seederData;
