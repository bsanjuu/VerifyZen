export const formatDate = (date: string | Date): string => {
  const d = new Date(date);
  return d.toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  });
};

export const formatShortDate = (date: string | Date): string => {
  const d = new Date(date);
  return d.toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'short',
  });
};

export const formatRelativeTime = (date: string | Date): string => {
  const d = new Date(date);
  const now = new Date();
  const diffMs = now.getTime() - d.getTime();
  const diffMins = Math.floor(diffMs / 60000);
  const diffHours = Math.floor(diffMs / 3600000);
  const diffDays = Math.floor(diffMs / 86400000);

  if (diffMins < 1) return 'just now';
  if (diffMins < 60) return diffMins + ' minute' + (diffMins > 1 ? 's' : '') + ' ago';
  if (diffHours < 24) return diffHours + ' hour' + (diffHours > 1 ? 's' : '') + ' ago';
  if (diffDays < 7) return diffDays + ' day' + (diffDays > 1 ? 's' : '') + ' ago';
  return formatDate(date);
};

export const formatCurrency = (amount: number): string => {
  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: 'USD',
  }).format(amount);
};

export const formatPercentage = (value: number, decimals = 0): string => {
  return value.toFixed(decimals) + '%';
};

export const formatRiskScore = (score: number): {
  label: string;
  color: string;
  bgColor: string;
} => {
  if (score >= 75) {
    return {
      label: 'High Risk',
      color: 'text-red-700',
      bgColor: 'bg-red-50',
    };
  } else if (score >= 50) {
    return {
      label: 'Medium Risk',
      color: 'text-orange-700',
      bgColor: 'bg-orange-50',
    };
  } else if (score >= 25) {
    return {
      label: 'Low Risk',
      color: 'text-yellow-700',
      bgColor: 'bg-yellow-50',
    };
  } else {
    return {
      label: 'Minimal Risk',
      color: 'text-green-700',
      bgColor: 'bg-green-50',
    };
  }
};

export const formatFullName = (firstName: string, lastName: string): string => {
  return firstName + ' ' + lastName;
};

export const formatInitials = (firstName: string, lastName: string): string => {
  return (firstName.charAt(0) + lastName.charAt(0)).toUpperCase();
};

export const truncateText = (text: string, maxLength: number): string => {
  if (text.length <= maxLength) return text;
  return text.slice(0, maxLength) + '...';
};
