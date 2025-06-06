import icon from '../../../assets/images/icon.ico';

export default function createIcoLink() {
  const linkIcon = document.createElement('link');
  linkIcon.rel = 'icon';
  linkIcon.type = 'image/x-icon';
  linkIcon.href = icon;
  document.head.append(linkIcon);
}
