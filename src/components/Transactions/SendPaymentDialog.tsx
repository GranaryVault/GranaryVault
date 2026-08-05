'use client';

import { useState } from 'react';
import {
  Dialog, DialogTitle, DialogContent, DialogActions, TextField,
  Select, MenuItem, FormControl, InputLabel, Button, Box, Typography,
  Chip, alpha, useTheme, CircularProgress, Alert, Link,
} from '@mui/material';
import {
  Send as SendIcon, CheckCircle as SuccessIcon,
  Error as ErrorIcon, OpenInNew as OpenIcon,
} from '@mui/icons-material';
import { useContract } from '@/hooks/useContract';
import { getExplorerTxUrl } from '@/lib/stellar';
import { useLiveBalance } from '@/hooks/useLiveBalance';

interface Props {
  open: boolean;
  onClose: () => void;
}

type TxPhase = 'idle' | 'building' | 'signing' | 'submitting' | 'success' | 'error';

export default function SendPaymentDialog({ open, onClose }: Props) {
  const theme = useTheme();
  const { sendPayment } = useContract();
  const { refresh } = useLiveBalance(0);

  const [destination, setDestination] = useState('');
  const [amount, setAmount] = useState('');
  const [asset, setAsset] = useState('native');
  const [memo, setMemo] = useState('');
  const [phase, setPhase] = useState<TxPhase>('idle');
  const [txHash, setTxHash] = useState('');
  const [errorMsg, setErrorMsg] = useState('');

  const handleSend = async () => {
    if (!destination.trim() || !amount.trim()) return;

    setPhase('submitting');
    setErrorMsg('');

    try {
      const result = await sendPayment({
        destination: destination.trim(),
        amount,
        memo: memo || undefined,
      });

      if (result) {
        setTxHash(result.txHash);
        setPhase('success');
        // Refresh balance after successful tx
        setTimeout(() => refresh(), 3000);
      } else {
        throw new Error('Transaction returned no hash');
      }
    } catch (err: unknown) {
      const message = err instanceof Error ? err.message : 'Transaction failed';
      setErrorMsg(message);
      setPhase('error');
    }
  };

  const handleClose = () => {
    setDestination('');
    setAmount('');
    setMemo('');
    setPhase('idle');
    setTxHash('');
    setErrorMsg('');
    onClose();
  };

  return (
    <Dialog open={open} onClose={phase !== 'submitting' ? handleClose : undefined} maxWidth="sm" fullWidth>
      <DialogTitle sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
        <SendIcon color="primary" />
        Send Payment on Testnet
      </DialogTitle>

      <DialogContent>
        {phase === 'success' ? (
          <Box sx={{ py: 4, textAlign: 'center' }}>
            <SuccessIcon sx={{ fontSize: 56, color: 'success.main', mb: 2 }} />
            <Typography variant="h6" sx={{ mb: 1 }}>Transaction Successful!</Typography>
            <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
              Your payment has been submitted to the Stellar Testnet.
            </Typography>
            {txHash && (
              <Box sx={{ mb: 2 }}>
                <Typography variant="caption" color="text.secondary" sx={{ display: 'block', mb: 0.5 }}>
                  Transaction Hash
                </Typography>
                <Typography variant="body2" sx={{ fontFamily: 'monospace', wordBreak: 'break-all', mb: 1,
                  p: 1, bgcolor: alpha(theme.palette.success.main, 0.05), borderRadius: 1 }}>
                  {txHash}
                </Typography>
                <Button
                  size="small"
                  variant="outlined"
                  endIcon={<OpenIcon />}
                  onClick={() => window.open(getExplorerTxUrl(txHash), '_blank')}
                  sx={{ textTransform: 'none', borderRadius: 2 }}
                >
                  View on Stellar Explorer
                </Button>
              </Box>
            )}
          </Box>
        ) : phase === 'error' ? (
          <Box sx={{ py: 4, textAlign: 'center' }}>
            <ErrorIcon sx={{ fontSize: 56, color: 'error.main', mb: 2 }} />
            <Typography variant="h6" sx={{ mb: 1 }}>Transaction Failed</Typography>
            <Alert severity="error" sx={{ mb: 2, textAlign: 'left' }}>
              {errorMsg}
            </Alert>
          </Box>
        ) : (
          <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2, mt: 1 }}>
            <FormControl fullWidth size="small">
              <InputLabel>Asset</InputLabel>
              <Select value={asset} label="Asset" onChange={(e) => setAsset(e.target.value)}>
                <MenuItem value="native">XLM (Native)</MenuItem>
                <MenuItem value="USDC">USDC</MenuItem>
              </Select>
            </FormControl>
            <TextField
              label="Destination Address"
              size="small"
              fullWidth
              value={destination}
              onChange={(e) => setDestination(e.target.value)}
              placeholder="GABC..."
              required
            />
            <TextField
              label="Amount"
              size="small"
              type="number"
              fullWidth
              value={amount}
              onChange={(e) => setAmount(e.target.value)}
              placeholder="0.00"
              required
              slotProps={{ htmlInput: { step: 'any', min: '0.0000001' } }}
            />
            <TextField
              label="Memo (optional)"
              size="small"
              fullWidth
              value={memo}
              onChange={(e) => setMemo(e.target.value)}
              placeholder="Payment reference..."
            />

            {phase === 'submitting' && (
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, justifyContent: 'center', py: 2 }}>
                <CircularProgress size={20} />
                <Typography variant="body2" color="text.secondary">
                  Submitting to Stellar Testnet...
                </Typography>
              </Box>
            )}
          </Box>
        )}
      </DialogContent>

      <DialogActions sx={{ p: 2.5 }}>
        {phase === 'success' || phase === 'error' ? (
          <>
            {phase === 'error' && (
              <Button variant="outlined" onClick={() => setPhase('idle')} sx={{ textTransform: 'none' }}>
                Try Again
              </Button>
            )}
            <Button variant="contained" onClick={handleClose} sx={{ textTransform: 'none', borderRadius: 2.5 }}>
              Close
            </Button>
          </>
        ) : (
          <>
            <Button onClick={handleClose} disabled={phase === 'submitting'} sx={{ textTransform: 'none' }}>
              Cancel
            </Button>
            <Button
              variant="contained"
              startIcon={phase === 'submitting' ? <CircularProgress size={16} color="inherit" /> : <SendIcon />}
              onClick={handleSend}
              disabled={!destination.trim() || !amount.trim() || phase === 'submitting'}
              sx={{ textTransform: 'none', borderRadius: 2.5 }}
            >
              {phase === 'submitting' ? 'Sending...' : 'Send Payment'}
            </Button>
          </>
        )}
      </DialogActions>
    </Dialog>
  );
}
