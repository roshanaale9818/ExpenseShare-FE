import { Helmet } from 'react-helmet-async';

import SettlementPreview from 'src/sections/settlement-preview/settlement-preview-view';

// ----------------------------------------------------------------------

export default function SettlementPreviewPage() {
  return (
    <>
      <Helmet>
        <title> Settlement Preview | Expense Share </title>
      </Helmet>

      <SettlementPreview />
    </>
  );
}
