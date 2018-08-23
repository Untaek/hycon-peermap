import { Grid, Paper, Typography } from '@material-ui/core'
import * as React from 'react'
import { IProps } from './iViewProps'
export class StatusView extends React.Component<IProps> {
  constructor(props) {
    super(props)
  }

  public render() {
    return (
      <div style={{ backgroundColor: '#eeeeee', padding: 16 }}>
        <Typography variant='display1' style={{ paddingTop: 36, paddingBottom: 36 }}>Latest HYCON Blockchain status</Typography>
        <Grid
          container
          direction='column'
          justify='center'
          spacing={16}
        >
          <Grid item>
            <Paper elevation={2} style={{ padding: 16 }}>
              <Typography variant='subheading' component='h3'>
                Current Block height
            </Typography>
              <Typography variant='title' component='h1'>
                {this.props.status.blockHeight}
              </Typography>
            </Paper>
          </Grid>
          <Grid item>
            <Paper elevation={2} style={{ padding: 16 }}>
              <Typography variant='subheading' component='h3'>
                Current difficulty <Typography color='textSecondary'>(Hex)</Typography>
              </Typography>
              <Typography variant='title' component='h1'>
                {this.props.status.difficulty}
              </Typography>
              <Typography variant='subheading' component='h2' color='textSecondary'>
                (0x{this.getHexTarget(this.props.status.difficulty)}...)
              </Typography>
            </Paper>
          </Grid>
          <Grid item>
            <Paper elevation={2} style={{ padding: 16 }}>
              <Typography variant='subheading' component='h3'>
                Estimated hash power
            </Typography>
              <Typography variant='title' component='h1'>
                {`${(1 / (this.props.status.difficulty * 30 / Math.LN2) / 1000).toFixed(2)} Khs`}
              </Typography>
            </Paper>
          </Grid>

        </Grid>

      </div>
    )
  }

  private getHexTarget(p: number, length: number = 32) {
    if (p > 1) { p = 1 }
    if (p < Math.pow(0x100, -length)) { p = Math.pow(0x100, -length) }
    const target = Buffer.alloc(length)
    let carry = 0
    for (let i = length - 1; i >= 0; i--) {
      carry = (0x100 * carry) + (p * 0xFF)
      target[i] = Math.floor(carry)
      carry -= target[i]
    }
    const buf = Buffer.from(target.slice(24, 32))
    return Buffer.from(buf.reverse()).toString('hex')
  }
}
