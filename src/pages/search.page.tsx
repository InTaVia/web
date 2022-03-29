import Container from '@mui/material/Container';
import Paper from '@mui/material/Paper';

import { SearchForm } from '@/features/search/SearchForm';
import { SearchPageFooter } from '@/features/search/SearchPageFooter';
import { SearchPageHeader } from '@/features/search/SearchPageHeader';
import { SearchResultsList } from '@/features/search/SearchResultsList';

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
