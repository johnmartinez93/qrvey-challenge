# Images Transformer - Serverless Application

1. Create bucket in AWS

   `aws s3api create-bucket --bucket <bucket-name> --region <region> --create-bucket-configuration LocationConstraint=<region>`


2. Package template

   `sam package --template-file template.yml --output-template-file packaged.yml --s3-bucket <bucket-name>`


3. Deploy package template

   `sam deploy --template-file packaged.yml --stack-name <stack-name> --capabilities CAPABILITY_IAM`