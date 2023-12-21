import './BeautifulTabs.css'

interface BeautifulTabsProps<T> {
  list: T[];
}

function BeautifulTabs<T>({ list }: BeautifulTabsProps<T>) {
  return <div className="tabs"></div>;
}

export default BeautifulTabs;
