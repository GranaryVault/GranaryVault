'use client';

import { useState } from 'react';
import {
  Box,
  Typography,
  Card,
  CardContent,
  Chip,
  alpha,
  useTheme,
  Paper,
  List,
  ListItem,
  ListItemText,
  Badge,
} from '@mui/material';
import { DateCalendar, PickerDay, PickerDayProps } from '@mui/x-date-pickers';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import dayjs, { Dayjs } from 'dayjs';
import { useTreasuryStore } from '@/store/treasuryStore';
import { Schedule as PayoutIcon } from '@mui/icons-material';

const CAT_COLORS: Record<string, string> = {
  Payroll: '#7C5CFC', Vendor: '#3B82F6', Grant: '#06D6A0',
  Contributor: '#F59E0B', Distribution: '#EC4899',
};

function formatCurrency(amount: number, currency?: string): string {
  const cur = currency || 'USD';
  if (['USD', 'EUR', 'GBP'].includes(cur)) return new Intl.NumberFormat('en-US', { style: 'currency', currency: cur, maximumFractionDigits: 0 }).format(amount);
  return `${amount.toLocaleString('en-US')} ${cur}`;
}

export default function PayoutCalendar() {
  const theme = useTheme();
  const { payouts } = useTreasuryStore();
  const [selectedDate, setSelectedDate] = useState<Dayjs | null>(dayjs());

  // Build map of dates that have payouts
  const payoutDates = new Map<string, typeof payouts>();
  payouts.forEach((p) => {
    const dateKey = dayjs(p.nextExecutionDate).format('YYYY-MM-DD');
    if (!payoutDates.has(dateKey)) payoutDates.set(dateKey, []);
    payoutDates.get(dateKey)!.push(p);
  });

  // Get payouts for selected date
  const selectedDateKey = selectedDate?.format('YYYY-MM-DD') || '';
  const selectedPayouts = payoutDates.get(selectedDateKey) || [];

  function PayoutDay(props: PickerDayProps) {
    const dateKey = props.day.format('YYYY-MM-DD');
    const hasPayouts = payoutDates.has(dateKey);

    return (
      <Badge
        key={props.day.toString()}
        overlap="circular"
        variant="dot"
        color="primary"
        invisible={!hasPayouts}
      >
        <PickerDay {...props} />
      </Badge>
    );
  }

  return (
    <LocalizationProvider dateAdapter={AdapterDayjs}>
      <Card>
        <CardContent sx={{ p: 3 }}>
          <Typography variant="h6" sx={{ mb: 3 }}>
            Payment Calendar
          </Typography>
          <Box sx={{ display: 'flex', gap: 3, flexWrap: 'wrap' }}>
            {/* Calendar */}
            <Paper
              variant="outlined"
              sx={{
                borderRadius: 3,
                overflow: 'hidden',
                flex: '0 0 auto',
                border: `1px solid ${theme.palette.divider}`,
              }}
            >
              <DateCalendar
                value={selectedDate}
                onChange={(newVal) => setSelectedDate(newVal)}
                slots={{ day: PayoutDay }}
                sx={{
                  '& .MuiPickersDay-root.Mui-selected': {
                    bgcolor: theme.palette.primary.main,
                  },
                }}
              />
            </Paper>

            {/* Payouts on selected date */}
            <Box sx={{ flex: 1, minWidth: 250 }}>
              <Typography variant="subtitle2" sx={{ mb: 2, fontWeight: 600 }}>
                {selectedDate
                  ? selectedDate.format('MMMM D, YYYY')
                  : 'Select a date'}
              </Typography>

              {selectedPayouts.length === 0 ? (
                <Box
                  sx={{
                    py: 6,
                    textAlign: 'center',
                    color: 'text.secondary',
                    border: `1px dashed ${theme.palette.divider}`,
                    borderRadius: 2,
                  }}
                >
                  <PayoutIcon sx={{ fontSize: 40, mb: 1, opacity: 0.3 }} />
                  <Typography variant="body2">No payouts scheduled for this date</Typography>
                </Box>
              ) : (
                <List disablePadding>
                  {selectedPayouts.map((payout) => (
                    <ListItem
                      key={payout.id}
                      sx={{
                        borderRadius: 2,
                        mb: 1,
                        border: `1px solid ${theme.palette.divider}`,
                        px: 2,
                      }}
                    >
                      <ListItemText
                        primary={payout.name}
                        secondary={
                          <>
                            {formatCurrency(payout.amount, payout.currency)} · {payout.frequency}
                          </>
                        }
                        slotProps={{
                          primary: { sx: { fontWeight: 600, fontSize: '0.875rem' } },
                          secondary: { sx: { fontSize: '0.75rem' } },
                        }}
                      />
                      <Chip
                        label={payout.category}
                        size="small"
                        sx={{
                          fontSize: '0.7rem',
                          fontWeight: 600,
                          bgcolor: alpha(CAT_COLORS[payout.category] || '#7C5CFC', 0.1),
                          color: CAT_COLORS[payout.category] || 'primary.light',
                        }}
                      />
                    </ListItem>
                  ))}
                </List>
              )}

              {/* All upcoming dates summary */}
              <Typography variant="subtitle2" sx={{ mt: 3, mb: 1, fontWeight: 600 }}>
                Upcoming Dates
              </Typography>
              <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 1 }}>
                {[...payoutDates.entries()]
                  .sort(([a], [b]) => a.localeCompare(b))
                  .slice(0, 6)
                  .map(([dateKey, datePayouts]) => (
                    <Chip
                      key={dateKey}
                      label={`${dayjs(dateKey).format('MMM D')} (${datePayouts.length})`}
                      size="small"
                      variant={dateKey === selectedDateKey ? 'filled' : 'outlined'}
                      color={dateKey === selectedDateKey ? 'primary' : 'default'}
                      onClick={() => setSelectedDate(dayjs(dateKey))}
                      sx={{ cursor: 'pointer', fontWeight: 500 }}
                    />
                  ))}
              </Box>
            </Box>
          </Box>
        </CardContent>
      </Card>
    </LocalizationProvider>
  );
}
