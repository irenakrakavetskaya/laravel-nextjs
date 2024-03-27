# Laravel  - Next.js App

## Install

git clone https://github.com/irenakrakavetskaya/laravel-nextjs.git

cd laravel-nextjs

composer install

config DB and add DB settings in .env

php artisan migrate

php artisan storage:link

php artisan serve

Ensure that your application's APP_URL and FRONTEND_URL environment variables are set to http://localhost:8000 and http://localhost:3000, respectively.

cd next

npm install

copy the .env.example file to .env.local and supply the URL of your backend:
NEXT_PUBLIC_BACKEND_URL=http://localhost:8000

npm run dev

The application will be available at http://localhost:3000

Register your user

Check pages:
http://localhost:3000/dashboard
http://localhost:3000/blog

Run frontEnd tests:
npm run test