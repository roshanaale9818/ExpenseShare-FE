// import Card from '@mui/material/Card';
import { PropTypes } from 'prop-types';

import Stack from '@mui/material/Stack';
// import Table from '@mui/material/Table';
import Button from '@mui/material/Button';
import Container from '@mui/material/Container';
// import TableBody from '@mui/material/TableBody';
import Typography from '@mui/material/Typography';

import Iconify from '../iconify';

export default function PageHeadView({
  name,
  labelForNewButton,
  onNewClick,
  hideNewButton,
  hideIcon,
}) {
  let pageName = 'Page';
  let labelForBtn = 'New';
  if (name) {
    pageName = name;
  }
  if (labelForNewButton && !hideNewButton) {
    labelForBtn = labelForNewButton;
  }

  const onNewHandler = () => {
    try {
      onNewClick();
    } catch (err) {
      console.error('Error- Missing handler on parent');
    }
  };
  return (
    <Container>
      <Stack direction="row" alignItems="center" justifyContent="space-between" mb={5}>
        <Typography variant="h4">{pageName}</Typography>

        {!hideNewButton && (
          <Button
            variant="contained"
            color="inherit"
            onClick={onNewHandler}
            startIcon={<Iconify icon="eva:plus-fill" />}
          >
            {labelForBtn}
          </Button>
        )}
      </Stack>
    </Container>
  );
}
PageHeadView.propTypes = {
  name: PropTypes.string,
  labelForNewButton: PropTypes.string,
  onNewClick: PropTypes.func,
  hideNewButton: PropTypes.bool,
  hideIcon: PropTypes.bool,
};
