export enum Provider {
  GOOGLE = 'google',
  YANDEX = 'yandex',
  VK = 'vk',
  MAILRU = 'mailru',
  LINKEDIN = 'linkedin',
  SLACK = 'slack',
  GITHUB = 'github',
  CREDENTIALS = 'credentials',
}

export enum UserRole {
  ADMIN = 'admin',
  STUDENT = 'student',
  TEACHER = 'teacher',
}

export const enum AuthStatus {
  AUTHENTICATED = 'authenticated',
  LOADING = 'loading',
  UNAUTHENTICATED = 'unauthenticated',
}

export const OAUTH_LABELS = {
  [Provider.GITHUB]: 'GitHub',
  [Provider.LINKEDIN]: 'LinkedIn',
  [Provider.YANDEX]: 'Yandex ID',
  [Provider.VK]: 'VK ID',
  [Provider.MAILRU]: 'Mail',
};

export const PASSWORD_VALIDATION = new RegExp(/^(?=.*?[A-Z])(?=.*?[a-z])(?=.*?[0-9]).{4,}$/);
