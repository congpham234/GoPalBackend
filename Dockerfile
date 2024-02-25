FROM public.ecr.aws/lambda/nodejs:18 as builder
WORKDIR /usr/app
COPY package.json package-lock.json ./
RUN npm install

COPY . ./
RUN npm rebuild

RUN npm run build

FROM public.ecr.aws/lambda/nodejs:18
WORKDIR ${LAMBDA_TASK_ROOT}
COPY --from=builder /usr/app/dist/* ./
COPY openapi-spec.json ./
CMD ["index.handler"]