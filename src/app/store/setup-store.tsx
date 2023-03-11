import { useSearchEventKindsQuery, useSearchRelationRolesQuery } from '@/api/intavia.service';

//FIXME
// backend for vocabulary search endpoints only returns all entries without using any parameters
// q: '',
// limit: 400,
// datasets: [
//   'https://apis.acdh.oeaw.ac.at/data',
//   'http://ldf.fi/nbf/data',
//   'http://data.biographynet.nl/',
//   'http://www.intavia.eu/sbi',
//   'http://data.acdh.oeaw.ac.at/intavia/cho/v1',
// ],

export function SetupStore(): null {
  useSearchEventKindsQuery({});
  useSearchRelationRolesQuery({});

  return null;
}
