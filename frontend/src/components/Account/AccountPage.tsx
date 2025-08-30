import React, { useEffect, useState } from 'react';
import {
  Box, Paper, Typography, Avatar, Divider, CircularProgress, Alert, Button, Link as MuiLink,
} from '@mui/material';
import { useTheme } from '../../hooks/useTheme';
import { accountService, Me } from '../../services/accountService';

const AccountPage: React.FC = () => {
  const { colors, shadows } = useTheme();
  const [me, setMe] = useState<Me | null>(null);
  const [loading, setLoading] = useState(true);
  const [err, setErr] = useState<string>('');

  useEffect(() => {
    let mounted = true;
    (async () => {
      try {
        const data = await accountService.getMe();
        if (!mounted) return;
        setMe(data);
      } catch (e: any) {
        setErr("Impossible de charger votre profil Trello.");
      } finally {
        if (mounted) setLoading(false);
      }
    })();
    return () => { mounted = false; };
  }, []);

  if (loading) {
    return (
      <Box sx={{ p: 3, display: 'flex', justifyContent: 'center' }}>
        <CircularProgress />
      </Box>
    );
  }

  if (err) {
    return (
      <Box sx={{ p: 3 }}>
        <Alert severity="error">{err}</Alert>
      </Box>
    );
  }

  if (!me) return null;

  const initials =
    me.initials ||
    (me.fullName ? me.fullName.split(' ').map(s => s[0]).slice(0,2).join('').toUpperCase() : me.username?.slice(0,2).toUpperCase());

  return (
    <Box sx={{ p: 3, maxWidth: 900, mx: 'auto' }}>
      <Typography variant="h4" sx={{ mb: 3, color: colors.text }}>
        Compte
      </Typography>

      <Paper
        elevation={0}
        sx={{ p: 3, bgcolor: colors.card, boxShadow: shadows.card, border: `1px solid ${colors.border}` }}
      >
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
          <Avatar
            src={me.avatarUrl || undefined}
            sx={{ width: 72, height: 72, fontSize: 28, bgcolor: colors.primary }}
            alt={me.fullName || me.username}
          >
            {initials}
          </Avatar>
          <Box>
            <Typography variant="h6" sx={{ color: colors.text }}>
              {me.fullName || me.username}
            </Typography>
            <Typography variant="body2" sx={{ color: colors.textSecondary }}>
              @{me.username}
            </Typography>
          </Box>
        </Box>

        <Divider sx={{ my: 3, borderColor: colors.border }} />

        <Box sx={{ display: 'grid', gridTemplateColumns: '160px 1fr', rowGap: 2 }}>
          <Typography sx={{ color: colors.textSecondary }}>Nom complet</Typography>
          <Typography sx={{ color: colors.text }}>{me.fullName || '—'}</Typography>

          <Typography sx={{ color: colors.textSecondary }}>Nom d’utilisateur</Typography>
          <Typography sx={{ color: colors.text }}>@{me.username}</Typography>

          <Typography sx={{ color: colors.textSecondary, alignSelf: 'start' }}>Biographie</Typography>
          <Typography sx={{ color: colors.text, whiteSpace: 'pre-wrap' }}>
            {me.bio || 'Aucune biographie.'}
          </Typography>

          <Typography sx={{ color: colors.textSecondary }}>Profil Trello</Typography>
          <MuiLink
            href={me.url || '#'}
            target="_blank"
            rel="noreferrer"
            sx={{ color: colors.primary }}
          >
            {me.url || '—'}
          </MuiLink>
        </Box>

        <Box sx={{ mt: 3 }}>
          <Button
            variant="outlined"
            href="https://id.atlassian.com/manage-profile/profile-and-visibility"
            target="_blank"
            rel="noreferrer"
          >
            Gérer mon profil Atlassian
          </Button>
        </Box>
      </Paper>
    </Box>
  );
};

export default AccountPage;
