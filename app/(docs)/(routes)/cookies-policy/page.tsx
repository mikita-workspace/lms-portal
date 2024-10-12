import { ArrowLeft } from 'lucide-react';
import { Metadata } from 'next';
import Link from 'next/link';
import { getTranslations } from 'next-intl/server';

export const metadata: Metadata = {
  title: 'Cookies Policy',
  description: 'Educational portal',
};

const CookiesPolicyPage = async () => {
  const t = await getTranslations('docs');

  return (
    <div className="p-6 flex flex-col mb-6">
      <div className="w-full">
        <Link
          className="flex items-center text-sm hover:opacity-75 transition duration-300 mb-6"
          href={'/'}
        >
          <ArrowLeft className="h-4 w-4 mr-2" />
          {t('backNav')}
        </Link>
      </div>
      <h1 className="text-2xl font-medium mb-12">Cookies Policy</h1>
      <p>Last updated: February 28, 2024</p>
      <p>
        This Cookies Policy explains what Cookies are and how We use them. You should read this
        policy so You can understand what type of cookies We use, or the information We collect
        using Cookies and how that information is used. This Cookies Policy has been created with
        the help of the{' '}
        <a href="https://www.termsfeed.com/cookies-policy-generator/" target="_blank">
          Cookies Policy Generator
        </a>
        .
      </p>
      <p>
        Cookies do not typically contain any information that personally identifies a user, but
        personal information that we store about You may be linked to the information stored in and
        obtained from Cookies. For further information on how We use, store and keep your personal
        data secure, see our Privacy Policy.
      </p>
      <p>
        We do not store sensitive personal information, such as mailing addresses, account
        passwords, etc. in the Cookies We use.
      </p>
      <h2>Interpretation and Definitions</h2>
      <h3>Interpretation</h3>
      <p>
        The words of which the initial letter is capitalized have meanings defined under the
        following conditions. The following definitions shall have the same meaning regardless of
        whether they appear in singular or in plural.
      </p>
      <h3>Definitions</h3>
      <p>For the purposes of this Cookies Policy:</p>
      <ul>
        <li>
          <strong>Company</strong> (referred to as either &quot;the Company&quot;, &quot;We&quot;,
          &quot;Us&quot; or &quot;Our&quot; in this Cookies Policy) refers to Nova LMS.
        </li>
        <li>
          <strong>Cookies</strong> means small files that are placed on Your computer, mobile device
          or any other device by a website, containing details of your browsing history on that
          website among its many uses.
        </li>
        <li>
          <strong>Website</strong> refers to Nova LMS, accessible from{' '}
          <a
            href="https://nova-lms-portal.vercel.app/"
            rel="external nofollow noopener"
            target="_blank"
          >
            https://nova-lms-portal.vercel.app/
          </a>
        </li>
        <li>
          <strong>You</strong> means the individual accessing or using the Website, or a company, or
          any legal entity on behalf of which such individual is accessing or using the Website, as
          applicable.
        </li>
      </ul>
      <h2>The use of the Cookies</h2>
      <h3>Type of Cookies We Use</h3>
      <p>
        Cookies can be &quot;Persistent&quot; or &quot;Session&quot; Cookies. Persistent Cookies
        remain on your personal computer or mobile device when You go offline, while Session Cookies
        are deleted as soon as You close your web browser.
      </p>
      <p>We use both session and persistent Cookies for the purposes set out below:</p>
      <ul>
        <li>
          <p>
            <strong>Necessary / Essential Cookies</strong>
          </p>
          <p>Type: Session Cookies</p>
          <p>Administered by: Us</p>
          <p>
            Purpose: These Cookies are essential to provide You with services available through the
            Website and to enable You to use some of its features. They help to authenticate users
            and prevent fraudulent use of user accounts. Without these Cookies, the services that
            You have asked for cannot be provided, and We only use these Cookies to provide You with
            those services.
          </p>
        </li>
        <li>
          <p>
            <strong>Functionality Cookies</strong>
          </p>
          <p>Type: Persistent Cookies</p>
          <p>Administered by: Us</p>
          <p>
            Purpose: These Cookies allow us to remember choices You make when You use the Website,
            such as remembering your login details or language preference. The purpose of these
            Cookies is to provide You with a more personal experience and to avoid You having to
            re-enter your preferences every time You use the Website.
          </p>
        </li>
      </ul>
      <h3>Your Choices Regarding Cookies</h3>
      <p>
        If You prefer to avoid the use of Cookies on the Website, first You must disable the use of
        Cookies in your browser and then delete the Cookies saved in your browser associated with
        this website. You may use this option for preventing the use of Cookies at any time.
      </p>
      <p>
        If You do not accept Our Cookies, You may experience some inconvenience in your use of the
        Website and some features may not function properly.
      </p>
      <p>
        If You&apos;d like to delete Cookies or instruct your web browser to delete or refuse
        Cookies, please visit the help pages of your web browser.
      </p>
      <ul>
        <li>
          <p>
            For the Chrome web browser, please visit this page from Google:{' '}
            <a
              href="https://support.google.com/accounts/answer/32050"
              rel="external nofollow noopener"
              target="_blank"
            >
              https://support.google.com/accounts/answer/32050
            </a>
          </p>
        </li>
        <li>
          <p>
            For the Internet Explorer web browser, please visit this page from Microsoft:{' '}
            <a
              href="http://support.microsoft.com/kb/278835"
              rel="external nofollow noopener"
              target="_blank"
            >
              http://support.microsoft.com/kb/278835
            </a>
          </p>
        </li>
        <li>
          <p>
            For the Firefox web browser, please visit this page from Mozilla:{' '}
            <a
              href="https://support.mozilla.org/en-US/kb/delete-cookies-remove-info-websites-stored"
              rel="external nofollow noopener"
              target="_blank"
            >
              https://support.mozilla.org/en-US/kb/delete-cookies-remove-info-websites-stored
            </a>
          </p>
        </li>
        <li>
          <p>
            For the Safari web browser, please visit this page from Apple:{' '}
            <a
              href="https://support.apple.com/guide/safari/manage-cookies-and-website-data-sfri11471/mac"
              rel="external nofollow noopener"
              target="_blank"
            >
              https://support.apple.com/guide/safari/manage-cookies-and-website-data-sfri11471/mac
            </a>
          </p>
        </li>
      </ul>
      <p>For any other web browser, please visit your web browser&apos;s official web pages.</p>
      <h3>More Information about Cookies</h3>
      <p>
        You can learn more about cookies here:{' '}
        <a href="https://www.termsfeed.com/blog/cookies/" target="_blank">
          All About Cookies by TermsFeed
        </a>
        .
      </p>
      <h3>Contact Us</h3>
      <p>If you have any questions about this Cookies Policy, You can contact us:</p>
      <ul>
        <li>By email: mkandratsyeu@gmail.com</li>
      </ul>
    </div>
  );
};

export default CookiesPolicyPage;
