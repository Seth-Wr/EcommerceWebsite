This is a ecommerce site that has a seller portal for sellers to update product information and upload new products with convienent interface.

Stripe is used to accept payment Postgres used to store data.

All photos are stored in aws s3 buckets and text data including the name to search for the pictures on s3 are stored on the postgres DB.

npm start starts the file and it runs on local host for the database.

you will ned to set in api keys for the email function the stripe and the aws.

The quickest way to deploy is with nginx reverse proxy on a ec2 instance on local host connected to ec2 ip4 address. its currently running on domain www.propatings.com
