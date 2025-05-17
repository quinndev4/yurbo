import { getYurbos } from '../../actions/getYurbos';

export default async function Map() {
  const yurbos = await getYurbos();

  console.log('Yurboooos', yurbos);

  return <div>Map</div>;
}
