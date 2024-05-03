'use server';

export const getAppConfig = async () => {
  try {
  } catch (error) {
    console.error('[GET_APP_CONFIG_ACTION]', error);

    return {
      authFlow: {},
    };
  }
};
