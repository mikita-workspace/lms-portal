export enum Provider {
  GOOGLE = 'google',
  YANDEX = 'yandex',
  LINKEDIN = 'linkedin',
  SLACK = 'slack',
  GITHUB = 'github',
}

export enum AuthStatus {
  AUTHENTICATED = 'authenticated',
  LOADING = 'loading',
  UNAUTHENTICATED = 'unauthenticated',
}

export enum UserRole {
  ADMIN = 'admin',
  STUDENT = 'student',
  TEACHER = 'teacher',
}

export const OAUTH_LABELS = {
  [Provider.GITHUB]: 'GitHub',
  [Provider.LINKEDIN]: 'LinkedIn',
  [Provider.YANDEX]: 'Yandex ID',
};
