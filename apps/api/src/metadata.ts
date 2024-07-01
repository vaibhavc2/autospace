/* eslint-disable */
export default async () => {
  const t = {};
  return {
    '@nestjs/graphql': {
      models: [
        [
          import('./users/dto/create-user.input'),
          { CreateUserInput: { exampleField: {} } },
        ],
        [
          import('./users/dto/update-user.input'),
          { UpdateUserInput: { id: {} } },
        ],
        [
          import('./users/entities/user.entity'),
          { User: { exampleField: {} } },
        ],
      ],
    },
  };
};
