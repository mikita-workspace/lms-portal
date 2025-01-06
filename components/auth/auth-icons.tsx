'use client';

import { Mail } from 'lucide-react';
import Image from 'next/image';
import { FaGithub } from 'react-icons/fa';
import { FcGoogle } from 'react-icons/fc';

import { Provider } from '@/constants/auth';

type IconProps = { className?: string };

const YandexIcon = ({ className }: IconProps) => (
  <Image
    className={className}
    src="/assets/yandex.svg"
    alt="yandex"
    height={20}
    width={20}
    priority
  />
);

const SlackIcon = ({ className }: IconProps) => (
  <Image
    className={className}
    src="/assets/slack.svg"
    alt="slack"
    height={16}
    width={16}
    priority
  />
);

const LinkedinIcon = ({ className }: IconProps) => (
  <Image
    className={className}
    src="/assets/linkedin.svg"
    alt="linkedin"
    height={20}
    width={20}
    priority
  />
);

const MailRuIcon = ({ className }: IconProps) => (
  <Image
    className={className}
    src="/assets/mailru.svg"
    alt="mailru"
    height={20}
    width={20}
    priority
  />
);

const VKIcon = ({ className }: IconProps) => (
  <Image className={className} src="/assets/vk.svg" alt="vk" height={20} width={20} priority />
);

export const authIcons = {
  [Provider.CREDENTIALS]: Mail,
  [Provider.GITHUB]: FaGithub,
  [Provider.GOOGLE]: FcGoogle,
  [Provider.LINKEDIN]: LinkedinIcon,
  [Provider.MAILRU]: MailRuIcon,
  [Provider.SLACK]: SlackIcon,
  [Provider.VK]: VKIcon,
  [Provider.YANDEX]: YandexIcon,
};
