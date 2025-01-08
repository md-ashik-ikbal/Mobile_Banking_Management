const Default_URL = "http://localhost:3333/"

const API_ENDPOINTS = {
    // User
    Create_User: Default_URL + "customer/signup",
    User_Profile: Default_URL + "customer/profile",

    // Auth
    Validate_Phone: Default_URL + "auth/validate_phone",
    Login: Default_URL + "auth/login",
    Logout: Default_URL + "auth/logout",

    // Password
    Forgot_Password: Default_URL + "customer/forgot_password",
    Change_Password: Default_URL + "customer/change_password",

    // Account
    Create_Personal_Account: Default_URL + "customer/create_personal_account",

    // Transaction
    Send_Money: Default_URL + "customer/sent_money",
    Cash_Out: Default_URL + "customer/cash_out",
    Make_Payment: Default_URL + "customer/make_payment"
}

export default API_ENDPOINTS;