import Container from '@mui/material/Container';
import Paper from '@mui/material/Paper';

import { SearchForm } from '@/features/entities/search-form';
import { SearchPageFooter } from '@/features/entities/search-page-footer';
import { SearchPageHeader } from '@/features/entities/search-page-header';
import { SearchResultsList } from '@/features/entities/search-results-list';

export default function SearchPage(): JSX.Element {
  return (
    <Container maxWidth="md" sx={{ display: 'grid', gap: 4, padding: 4 }}>
      <SearchPageHeader />
      <Paper>
        <SearchForm />
        <SearchResultsList />
        <SearchPageFooter />
      </Paper>
    </Container>
  );
}
