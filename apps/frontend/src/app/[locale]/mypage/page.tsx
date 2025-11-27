'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useLocale, useTranslations } from 'next-intl';
import { User, FileText, CreditCard, Wallet, Settings, ChevronRight } from 'lucide-react';
import { motion } from 'framer-motion';
import { Card, CardContent, CardHeader, CardTitle, Badge, Button } from '@/components/ui';
import { api } from '@/lib/api';
import { useAuthStore } from '@/store/auth';
import { formatCurrency, formatDate } from '@/lib/utils';

type Tab = 'profile' | 'history' | 'payments' | 'credits' | 'settings';

export default function MyPage() {
  const t = useTranslations('mypage');
  const locale = useLocale();
  const router = useRouter();
  const { user, isAuthenticated, loadUser } = useAuthStore();

  const [activeTab, setActiveTab] = useState<Tab>('profile');
  const [diagnosisResults, setDiagnosisResults] = useState<any[]>([]);
  const [creditBalance, setCreditBalance] = useState<any>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    if (!isAuthenticated) {
      router.push(`/${locale}/auth/login`);
      return;
    }
    loadUser();
    fetchData();
  }, [isAuthenticated]);

  const fetchData = async () => {
    try {
      setIsLoading(true);
      const [results, balance] = await Promise.all([
        api.getUserDiagnosisResults({ pageSize: 5 }),
        api.getCreditBalance(),
      ]);
      setDiagnosisResults(results.results || []);
      setCreditBalance(balance);
    } catch (error) {
      console.error('Failed to fetch data:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const tabs = [
    { key: 'profile' as Tab, label: t('tabs.profile'), icon: User },
    { key: 'history' as Tab, label: t('tabs.history'), icon: FileText },
    { key: 'payments' as Tab, label: t('tabs.payments'), icon: CreditCard },
    { key: 'credits' as Tab, label: t('tabs.credits'), icon: Wallet },
    { key: 'settings' as Tab, label: t('tabs.settings'), icon: Settings },
  ];

  if (!isAuthenticated || !user) {
    return null;
  }

  return (
    <div className="min-h-screen bg-calm-beige py-12">
      <div className="container-wide">
        <h1 className="text-h1 text-deep-navy mb-8">{t('title')}</h1>

        <div className="grid grid-cols-1 desktop:grid-cols-4 gap-8">
          {/* Sidebar */}
          <div className="desktop:col-span-1">
            <Card>
              <CardContent className="p-4">
                {/* User Info */}
                <div className="flex items-center gap-4 pb-4 mb-4 border-b border-sand-brown/20">
                  <div className="w-16 h-16 bg-sand-brown/20 rounded-full flex items-center justify-center">
                    {user.avatar ? (
                      <img src={user.avatar} alt={user.name} className="w-full h-full rounded-full object-cover" />
                    ) : (
                      <User className="w-8 h-8 text-sand-brown" />
                    )}
                  </div>
                  <div>
                    <p className="font-semibold text-deep-navy">{user.name}</p>
                    <p className="text-sm text-warm-gray">{user.email}</p>
                  </div>
                </div>

                {/* Navigation */}
                <nav className="space-y-1">
                  {tabs.map((tab) => {
                    const Icon = tab.icon;
                    return (
                      <button
                        key={tab.key}
                        onClick={() => setActiveTab(tab.key)}
                        className={`w-full flex items-center gap-3 px-4 py-3 rounded-button transition-colors ${
                          activeTab === tab.key
                            ? 'bg-deep-navy text-white'
                            : 'text-warm-gray hover:bg-sand-brown/10'
                        }`}
                      >
                        <Icon className="w-5 h-5" />
                        <span>{tab.label}</span>
                      </button>
                    );
                  })}
                </nav>
              </CardContent>
            </Card>

            {/* Credit Balance Card */}
            <Card className="mt-4 bg-deep-navy text-white">
              <CardContent className="p-4">
                <p className="text-sm text-warm-gray mb-1">{t('credits.balance')}</p>
                <p className="text-2xl font-bold">{creditBalance?.balance || 0} クレジット</p>
                <Button
                  variant="secondary"
                  size="sm"
                  className="mt-4 w-full"
                  onClick={() => router.push(`/${locale}/credits/purchase`)}
                >
                  {t('credits.purchase')}
                </Button>
              </CardContent>
            </Card>
          </div>

          {/* Main Content */}
          <div className="desktop:col-span-3">
            {activeTab === 'profile' && (
              <motion.div
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
              >
                <Card>
                  <CardHeader>
                    <CardTitle>{t('profile.title')}</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <form className="space-y-6">
                      <div className="grid grid-cols-1 tablet:grid-cols-2 gap-6">
                        <div>
                          <label className="label">{t('profile.name')}</label>
                          <input
                            type="text"
                            defaultValue={user.name}
                            className="input"
                          />
                        </div>
                        <div>
                          <label className="label">{t('profile.nickname')}</label>
                          <input
                            type="text"
                            placeholder="ニックネーム"
                            className="input"
                          />
                        </div>
                        <div className="tablet:col-span-2">
                          <label className="label">{t('profile.email')}</label>
                          <input
                            type="email"
                            defaultValue={user.email}
                            disabled
                            className="input bg-calm-beige"
                          />
                        </div>
                      </div>
                      <Button type="submit">{t('profile.save')}</Button>
                    </form>
                  </CardContent>
                </Card>
              </motion.div>
            )}

            {activeTab === 'history' && (
              <motion.div
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
              >
                <Card>
                  <CardHeader>
                    <CardTitle>{t('tabs.history')}</CardTitle>
                  </CardHeader>
                  <CardContent>
                    {isLoading ? (
                      <div className="space-y-4">
                        {[...Array(3)].map((_, i) => (
                          <div key={i} className="animate-pulse h-20 bg-sand-brown/20 rounded-card" />
                        ))}
                      </div>
                    ) : diagnosisResults.length === 0 ? (
                      <div className="text-center py-12">
                        <FileText className="w-12 h-12 text-sand-brown/50 mx-auto mb-4" />
                        <p className="text-warm-gray">診断履歴がありません</p>
                        <Button
                          variant="outline"
                          className="mt-4"
                          onClick={() => router.push(`/${locale}/diagnosis`)}
                        >
                          診断を受ける
                        </Button>
                      </div>
                    ) : (
                      <div className="space-y-4">
                        {diagnosisResults.map((result) => (
                          <div
                            key={result.id}
                            className="flex items-center justify-between p-4 bg-calm-beige rounded-card hover:bg-sand-brown/10 transition-colors cursor-pointer"
                            onClick={() => router.push(`/${locale}/diagnosis/result/${result.id}`)}
                          >
                            <div>
                              <p className="font-semibold text-deep-navy">
                                {result.session?.diagnosis?.title}
                              </p>
                              <p className="text-sm text-warm-gray">
                                {formatDate(result.createdAt, locale)}
                              </p>
                            </div>
                            <div className="flex items-center gap-3">
                              <Badge variant="success">{result.resultType}</Badge>
                              <ChevronRight className="w-5 h-5 text-warm-gray" />
                            </div>
                          </div>
                        ))}
                      </div>
                    )}
                  </CardContent>
                </Card>
              </motion.div>
            )}

            {activeTab === 'credits' && (
              <motion.div
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
              >
                <Card>
                  <CardHeader>
                    <CardTitle>{t('tabs.credits')}</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="grid grid-cols-3 gap-4 mb-8">
                      <div className="bg-calm-beige rounded-card p-4 text-center">
                        <p className="text-sm text-warm-gray">残高</p>
                        <p className="text-2xl font-bold text-deep-navy">{creditBalance?.balance || 0}</p>
                      </div>
                      <div className="bg-calm-beige rounded-card p-4 text-center">
                        <p className="text-sm text-warm-gray">累計獲得</p>
                        <p className="text-2xl font-bold text-success">{creditBalance?.totalEarned || 0}</p>
                      </div>
                      <div className="bg-calm-beige rounded-card p-4 text-center">
                        <p className="text-sm text-warm-gray">累計使用</p>
                        <p className="text-2xl font-bold text-error">{creditBalance?.totalSpent || 0}</p>
                      </div>
                    </div>

                    <h3 className="text-h3 mb-4">{t('credits.history')}</h3>
                    <p className="text-warm-gray text-center py-8">利用履歴がありません</p>
                  </CardContent>
                </Card>
              </motion.div>
            )}

            {activeTab === 'payments' && (
              <motion.div
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
              >
                <Card>
                  <CardHeader>
                    <CardTitle>{t('tabs.payments')}</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <p className="text-warm-gray text-center py-8">決済履歴がありません</p>
                  </CardContent>
                </Card>
              </motion.div>
            )}

            {activeTab === 'settings' && (
              <motion.div
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
              >
                <Card>
                  <CardHeader>
                    <CardTitle>{t('tabs.settings')}</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-6">
                      <div className="flex items-center justify-between p-4 bg-calm-beige rounded-card">
                        <div>
                          <p className="font-semibold text-deep-navy">言語設定</p>
                          <p className="text-sm text-warm-gray">表示言語を変更</p>
                        </div>
                        <select className="input w-auto">
                          <option value="ja">日本語</option>
                          <option value="ko">한국어</option>
                          <option value="en">English</option>
                        </select>
                      </div>

                      <div className="flex items-center justify-between p-4 bg-calm-beige rounded-card">
                        <div>
                          <p className="font-semibold text-deep-navy">メール通知</p>
                          <p className="text-sm text-warm-gray">お知らせメールの受信設定</p>
                        </div>
                        <label className="relative inline-flex items-center cursor-pointer">
                          <input type="checkbox" className="sr-only peer" defaultChecked />
                          <div className="w-11 h-6 bg-sand-brown/30 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-deep-navy"></div>
                        </label>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </motion.div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
