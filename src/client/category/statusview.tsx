import { Grid, Paper, Typography } from '@material-ui/core'
import * as React from 'react'
import { IProps } from './iViewProps'
export class StatusView extends React.Component<IProps> {
  constructor(props) {
    super(props)
  }

  public render() {
    return (
      <div>
        <Grid
          container
          direction='column'
          justify='space-between'
          style={{ padding: 16 }}
          spacing={16}
        >
          <Grid item>
            <Paper elevation={2} style={{ padding: 16 }}>
              <Typography variant='subheading' component='h3'>
                Block height
            </Typography>
              <Typography variant='title' component='h1'>
                123456
            </Typography>
            </Paper>
          </Grid>
          <Grid item>
            <Paper elevation={2} style={{ padding: 16 }}>
              <Typography variant='subheading' component='h3'>
                Current difficulty
            </Typography>
              <Typography variant='title' component='h1'>
                123456235325
            </Typography>
            </Paper>
          </Grid>
          <Grid item>
            <Paper elevation={2} style={{ padding: 16 }}>
              <Typography variant='subheading' component='h3'>
                Presumed hash power
            </Typography>
              <Typography variant='title' component='h1'>
                123456234
            </Typography>
            </Paper>
          </Grid>

        </Grid>

      </div>
    )
  }
}
