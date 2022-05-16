import Container from '@mui/material/Container';
import Paper from '@mui/material/Paper';

import { CollectionEntitiesList } from '@/features/entities/collection-entities-list';
import { PageTitle } from '@/features/ui/PageTitle';

export default function CollectionsPage(): JSX.Element {
  return (
    <Container maxWidth="md" sx={{ display: 'grid', gap: 4, padding: 4 }}>
      <header>
        <PageTitle>Collections</PageTitle>
      </header>
      <Paper>
        <CollectionEntitiesList />
      </Paper>
    </Container>
  );
}
