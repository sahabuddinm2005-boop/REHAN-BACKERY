# Rehan Bakery Shop - Latest Updates

Added requested features:

1. Custom 404 page
   - Route: any wrong URL, for example `/wrong-page`

2. Settings page
   - Route: `/settings`
   - Notification, appearance, language and security preference UI

3. Profile page
   - Route: `/profile`
   - User can edit name, email, phone and address in demo/local mode

4. Forgot Password page
   - Route: `/forgot-password`
   - Login page now has Forgot Password link
   - Demo reset link is generated on screen

5. Registration role option
   - Register as User/Customer or Delivery Boy
   - Admin public registration is blocked for safety

Backend/PHP database updates:
- users role now supports `customer`, `admin`, `delivery`
- register API saves selected role
- login API fixed `full_name AS name`

Run:
```bash
npm install
npm run dev
```
Open:
```text
http://localhost:5173
```


## Latest Update - Registration/Profile/Delivery Request

1. Registration page se User/Delivery role option remove kar diya gaya. Public registration ab hamesha normal customer/user account banata hai.
2. Backend `register.php` me bhi public registration ka role forcefully `customer` set kiya gaya hai.
3. Profile page me Name aur Gmail/Email locked/read-only kar diya gaya hai, user ise change nahi kar sakta.
4. Profile page me phone aur address update option rakha gaya hai.
5. Normal user ke profile page me Delivery Partner Request Form add kiya gaya hai. User delivery banne ke liye request submit kar sakta hai.
6. `database/rehan_bakery_shop.sql` me future backend use ke liye `delivery_requests` table add ki gayi hai.
