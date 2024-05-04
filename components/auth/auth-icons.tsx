'use client';

import Image from 'next/image';
import { FaGithub } from 'react-icons/fa';
import { FcGoogle } from 'react-icons/fc';

import { Provider } from '@/constants/auth';
const YandexIcon = () => (
  <Image className="mr-4" src="/assets/yandex.svg" alt="yandex" height={20} width={20} priority />
);

const SlackIcon = () => (
  <Image
    className="ml-0.5 mr-[1.125rem]"
    src="/assets/slack.svg"
    alt="slack"
    height={16}
    width={16}
    priority
  />
);

const LinkedinIcon = () => (
  <Image className="mr-4" src="/assets/linkedin.svg" alt="yandex" height={20} width={20} priority />
);

export const authIcons = {
  [Provider.GITHUB]: FaGithub,
  [Provider.GOOGLE]: FcGoogle,
  [Provider.LINKEDIN]: LinkedinIcon,
  [Provider.SLACK]: SlackIcon,
  [Provider.YANDEX]: YandexIcon,
};
