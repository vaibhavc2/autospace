import { DocumentBuilder } from '@nestjs/swagger';

export const swaggerConfig = new DocumentBuilder()
  .setTitle('Autospace | Vaibhav Chopra')
  .setDescription(
    `<div>Welcome to the 'Autospace' API documentation.</div>
<h2>Looking for the graphql api?</h2>
<div>Go to <a href="/graphql" target="_blank">/graphql</a>.
Or,
You might also need to use the <a target="_blank" href="https://studio.apollographql.com/sandbox/explorer?endpoint=http://localhost:3000/graphql&document=query users{users{ id }}
">Apollo explorer</a> for a greater experience.</div>`,
  )
  .setVersion('0.1')
  .addBearerAuth()
  .build();
