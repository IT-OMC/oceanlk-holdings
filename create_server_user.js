db = db.getSiblingDB('oceanlk-dev');
db.admin_users.updateOne(
    { username: "testadmin" },
    { $set: { active: true, verified: true } },
    { upsert: true }
);
console.log("User testadmin updated/created successfully in oceanlk-dev");
