import { User } from "./../../../users/models/User";

// TODO: Fix this...
xit("should return an email", async () => {
    const data = { email: "test@unit.com", password: "12345" };
    // const user = new User(data);
    // const savedUser = await user.save();
    const user = await User.create(data);
    console.log("User: ", user);
    const email = await user.short();
    expect(email).toEqual(data.email);
});