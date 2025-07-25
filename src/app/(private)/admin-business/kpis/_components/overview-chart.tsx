'use client';

import { Bar, BarChart, ResponsiveContainer, XAxis, YAxis } from 'recharts';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';

const data = [
  { name: 'Ene', total: 1200 },
  { name: 'Feb', total: 1900 },
  { name: 'Mar', total: 1500 },
  { name: 'Abr', total: 1700 },
  { name: 'May', total: 2200 },
  { name: 'Jun', total: 2800 },
  { name: 'Jul', total: 2400 },
  { name: 'Ago', total: 2900 },
  { name: 'Sep', total: 3100 },
  { name: 'Oct', total: 3500 },
  { name: 'Nov', total: 3200 },
  { name: 'Dic', total: 3800 },
];

export default function OverviewChart() {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Visión General</CardTitle>
        <CardDescription>Número total de usuarios atendidos por mes</CardDescription>
      </CardHeader>
      <CardContent className="pl-2">

        <ResponsiveContainer width="100%" height={350}>
          <BarChart data={data}>
            <XAxis
              dataKey="name"
              stroke="#888888"
              fontSize={12}
              tickLine={false}
              axisLine={false}
            />
            <YAxis
              stroke="#888888"
              fontSize={12}
              tickLine={false}
              axisLine={false}
              tickFormatter={(value) => `${value}`}
            />
            <Bar
              dataKey="total"
              fill="currentColor"
              radius={[4, 4, 0, 0]}
              className="fill-primary"
            />
          </BarChart>
        </ResponsiveContainer>

      </CardContent>
    </Card>
  );
}
