import { useState, useEffect } from "react";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Progress } from "@/components/ui/progress";
import Icon from "@/components/ui/icon";
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

interface DataRecord {
  id: string;
  nick: string;
  cost: number;
  check: string;
  purchase: string;
  time: string;
  date: string;
  status: "pending" | "completed" | "cancelled";
}

const Index = () => {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [loginData, setLoginData] = useState({ username: "", password: "" });
  const [data, setData] = useState<DataRecord[]>([]);
  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false);
  const [newRecord, setNewRecord] = useState<Omit<DataRecord, "id">>({
    nick: "",
    cost: 0,
    check: "",
    purchase: "",
    time: "",
    date: "",
    status: "pending",
  });

  useEffect(() => {
    const savedData = localStorage.getItem("adminData");
    if (savedData) {
      setData(JSON.parse(savedData));
    }

    const savedLogin = localStorage.getItem("adminLogin");
    if (savedLogin) {
      setIsLoggedIn(true);
    }
  }, []);

  const handleLogin = () => {
    if (loginData.username === "admin" && loginData.password === "admin123") {
      setIsLoggedIn(true);
      localStorage.setItem("adminLogin", "true");
    } else {
      alert("Неверные данные для входа");
    }
  };

  const handleLogout = () => {
    setIsLoggedIn(false);
    localStorage.removeItem("adminLogin");
  };

  const addRecord = () => {
    const record: DataRecord = {
      ...newRecord,
      id: Date.now().toString(),
      time: new Date().toLocaleTimeString("ru-RU"),
      date: new Date().toLocaleDateString("ru-RU"),
    };

    const updatedData = [...data, record];
    setData(updatedData);
    localStorage.setItem("adminData", JSON.stringify(updatedData));

    setNewRecord({
      nick: "",
      cost: 0,
      check: "",
      purchase: "",
      time: "",
      date: "",
      status: "pending",
    });
    setIsAddDialogOpen(false);
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case "completed":
        return "bg-green-500";
      case "cancelled":
        return "bg-red-500";
      default:
        return "bg-yellow-500";
    }
  };

  const getStatusText = (status: string) => {
    switch (status) {
      case "completed":
        return "Выполнено";
      case "cancelled":
        return "Отменено";
      default:
        return "В ожидании";
    }
  };

  if (!isLoggedIn) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center p-4 dark">
        <Card className="w-full max-w-md admin-card">
          <CardHeader className="text-center">
            <div className="flex items-center justify-center mb-4">
              <Icon name="Shield" size={40} className="text-primary" />
            </div>
            <CardTitle className="text-2xl font-bold">Админ Панель</CardTitle>
            <CardDescription>Войдите в систему для продолжения</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="username">Логин</Label>
              <Input
                id="username"
                type="text"
                placeholder="Введите логин"
                value={loginData.username}
                onChange={(e) =>
                  setLoginData({ ...loginData, username: e.target.value })
                }
                className="admin-input"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="password">Пароль</Label>
              <Input
                id="password"
                type="password"
                placeholder="Введите пароль"
                value={loginData.password}
                onChange={(e) =>
                  setLoginData({ ...loginData, password: e.target.value })
                }
                className="admin-input"
              />
            </div>
            <Button
              onClick={handleLogin}
              className="w-full admin-button bg-primary hover:bg-primary/90"
            >
              <Icon name="LogIn" size={16} className="mr-2" />
              Войти
            </Button>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background dark">
      <div className="border-b border-border bg-card/50 backdrop-blur supports-[backdrop-filter]:bg-card/50">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-3">
              <Icon name="Shield" size={32} className="text-primary" />
              <h1 className="text-2xl font-bold">Админ Панель</h1>
            </div>
            <Button
              onClick={handleLogout}
              variant="outline"
              size="sm"
              className="admin-button"
            >
              <Icon name="LogOut" size={16} className="mr-2" />
              Выйти
            </Button>
          </div>
        </div>
      </div>

      <div className="container mx-auto px-4 py-8">
        <Tabs defaultValue="dashboard" className="space-y-6">
          <TabsList className="grid w-full grid-cols-4">
            <TabsTrigger value="dashboard">Дашборд</TabsTrigger>
            <TabsTrigger value="data">Данные</TabsTrigger>
            <TabsTrigger value="analytics">Аналитика</TabsTrigger>
            <TabsTrigger value="settings">Настройки</TabsTrigger>
          </TabsList>

          <TabsContent value="dashboard" className="space-y-6">
            <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
              <Card className="admin-card">
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium">
                    Всего записей
                  </CardTitle>
                  <Icon
                    name="Database"
                    size={16}
                    className="text-muted-foreground"
                  />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">{data.length}</div>
                  <p className="text-xs text-muted-foreground">
                    +20% от прошлого месяца
                  </p>
                </CardContent>
              </Card>

              <Card className="admin-card">
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium">
                    Общая стоимость
                  </CardTitle>
                  <Icon
                    name="DollarSign"
                    size={16}
                    className="text-muted-foreground"
                  />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">
                    {data
                      .reduce((sum, record) => sum + record.cost, 0)
                      .toLocaleString()}{" "}
                    ₽
                  </div>
                  <p className="text-xs text-muted-foreground">
                    +15% от прошлого месяца
                  </p>
                </CardContent>
              </Card>

              <Card className="admin-card">
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium">
                    Выполнено
                  </CardTitle>
                  <Icon
                    name="CheckCircle"
                    size={16}
                    className="text-muted-foreground"
                  />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">
                    {
                      data.filter((record) => record.status === "completed")
                        .length
                    }
                  </div>
                  <p className="text-xs text-muted-foreground">
                    +8% от прошлого месяца
                  </p>
                </CardContent>
              </Card>

              <Card className="admin-card">
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium">
                    В ожидании
                  </CardTitle>
                  <Icon
                    name="Clock"
                    size={16}
                    className="text-muted-foreground"
                  />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">
                    {
                      data.filter((record) => record.status === "pending")
                        .length
                    }
                  </div>
                  <p className="text-xs text-muted-foreground">
                    -5% от прошлого месяца
                  </p>
                </CardContent>
              </Card>
            </div>

            <div className="grid gap-4 md:grid-cols-2">
              <Card className="admin-card">
                <CardHeader>
                  <CardTitle>Статистика статусов</CardTitle>
                </CardHeader>
                <CardContent className="space-y-3">
                  <div className="space-y-2">
                    <div className="flex items-center justify-between">
                      <span className="text-sm">Выполнено</span>
                      <span className="text-sm font-medium">
                        {data.filter((r) => r.status === "completed").length}
                      </span>
                    </div>
                    <Progress
                      value={
                        (data.filter((r) => r.status === "completed").length /
                          data.length) *
                          100 || 0
                      }
                      className="h-2"
                    />
                  </div>
                  <div className="space-y-2">
                    <div className="flex items-center justify-between">
                      <span className="text-sm">В ожидании</span>
                      <span className="text-sm font-medium">
                        {data.filter((r) => r.status === "pending").length}
                      </span>
                    </div>
                    <Progress
                      value={
                        (data.filter((r) => r.status === "pending").length /
                          data.length) *
                          100 || 0
                      }
                      className="h-2"
                    />
                  </div>
                  <div className="space-y-2">
                    <div className="flex items-center justify-between">
                      <span className="text-sm">Отменено</span>
                      <span className="text-sm font-medium">
                        {data.filter((r) => r.status === "cancelled").length}
                      </span>
                    </div>
                    <Progress
                      value={
                        (data.filter((r) => r.status === "cancelled").length /
                          data.length) *
                          100 || 0
                      }
                      className="h-2"
                    />
                  </div>
                </CardContent>
              </Card>

              <Card className="admin-card">
                <CardHeader>
                  <CardTitle>Последние действия</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-3">
                    {data
                      .slice(-5)
                      .reverse()
                      .map((record) => (
                        <div
                          key={record.id}
                          className="flex items-center space-x-3"
                        >
                          <div
                            className={`w-2 h-2 rounded-full ${getStatusColor(record.status)}`}
                          />
                          <div className="flex-1 min-w-0">
                            <p className="text-sm font-medium truncate">
                              {record.nick}
                            </p>
                            <p className="text-xs text-muted-foreground">
                              {record.purchase}
                            </p>
                          </div>
                          <div className="text-xs text-muted-foreground">
                            {record.time}
                          </div>
                        </div>
                      ))}
                  </div>
                </CardContent>
              </Card>
            </div>
          </TabsContent>

          <TabsContent value="data" className="space-y-6">
            <div className="flex items-center justify-between">
              <h2 className="text-2xl font-bold">Управление данными</h2>
              <Dialog open={isAddDialogOpen} onOpenChange={setIsAddDialogOpen}>
                <DialogTrigger asChild>
                  <Button className="admin-button bg-primary hover:bg-primary/90">
                    <Icon name="Plus" size={16} className="mr-2" />
                    Добавить запись
                  </Button>
                </DialogTrigger>
                <DialogContent className="sm:max-w-[425px]">
                  <DialogHeader>
                    <DialogTitle>Добавить новую запись</DialogTitle>
                    <DialogDescription>
                      Заполните форму для добавления новой записи в базу данных
                    </DialogDescription>
                  </DialogHeader>
                  <div className="grid gap-4 py-4">
                    <div className="grid grid-cols-4 items-center gap-4">
                      <Label htmlFor="nick" className="text-right">
                        Ник
                      </Label>
                      <Input
                        id="nick"
                        value={newRecord.nick}
                        onChange={(e) =>
                          setNewRecord({ ...newRecord, nick: e.target.value })
                        }
                        className="col-span-3"
                      />
                    </div>
                    <div className="grid grid-cols-4 items-center gap-4">
                      <Label htmlFor="cost" className="text-right">
                        Стоимость
                      </Label>
                      <Input
                        id="cost"
                        type="number"
                        value={newRecord.cost}
                        onChange={(e) =>
                          setNewRecord({
                            ...newRecord,
                            cost: parseFloat(e.target.value) || 0,
                          })
                        }
                        className="col-span-3"
                      />
                    </div>
                    <div className="grid grid-cols-4 items-center gap-4">
                      <Label htmlFor="check" className="text-right">
                        Чек
                      </Label>
                      <Input
                        id="check"
                        value={newRecord.check}
                        onChange={(e) =>
                          setNewRecord({ ...newRecord, check: e.target.value })
                        }
                        className="col-span-3"
                      />
                    </div>
                    <div className="grid grid-cols-4 items-center gap-4">
                      <Label htmlFor="purchase" className="text-right">
                        Покупка
                      </Label>
                      <Textarea
                        id="purchase"
                        value={newRecord.purchase}
                        onChange={(e) =>
                          setNewRecord({
                            ...newRecord,
                            purchase: e.target.value,
                          })
                        }
                        className="col-span-3"
                      />
                    </div>
                    <div className="grid grid-cols-4 items-center gap-4">
                      <Label htmlFor="status" className="text-right">
                        Статус
                      </Label>
                      <Select
                        value={newRecord.status}
                        onValueChange={(
                          value: "pending" | "completed" | "cancelled",
                        ) => setNewRecord({ ...newRecord, status: value })}
                      >
                        <SelectTrigger className="col-span-3">
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="pending">В ожидании</SelectItem>
                          <SelectItem value="completed">Выполнено</SelectItem>
                          <SelectItem value="cancelled">Отменено</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                  </div>
                  <div className="flex justify-end space-x-2">
                    <Button
                      variant="outline"
                      onClick={() => setIsAddDialogOpen(false)}
                    >
                      Отмена
                    </Button>
                    <Button
                      onClick={addRecord}
                      className="bg-primary hover:bg-primary/90"
                    >
                      Добавить
                    </Button>
                  </div>
                </DialogContent>
              </Dialog>
            </div>

            <Card className="admin-card">
              <CardContent className="p-0">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Ник</TableHead>
                      <TableHead>Стоимость</TableHead>
                      <TableHead>Чек</TableHead>
                      <TableHead>Покупка</TableHead>
                      <TableHead>Время</TableHead>
                      <TableHead>Дата</TableHead>
                      <TableHead>Статус</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {data.map((record) => (
                      <TableRow key={record.id}>
                        <TableCell className="font-medium">
                          {record.nick}
                        </TableCell>
                        <TableCell>{record.cost.toLocaleString()} ₽</TableCell>
                        <TableCell>{record.check}</TableCell>
                        <TableCell className="max-w-[200px] truncate">
                          {record.purchase}
                        </TableCell>
                        <TableCell>{record.time}</TableCell>
                        <TableCell>{record.date}</TableCell>
                        <TableCell>
                          <Badge
                            variant="secondary"
                            className={`${getStatusColor(record.status)} text-white`}
                          >
                            {getStatusText(record.status)}
                          </Badge>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="analytics" className="space-y-6">
            <Card className="admin-card">
              <CardHeader>
                <CardTitle>Аналитика продаж</CardTitle>
                <CardDescription>
                  Детальная статистика по операциям
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="text-center py-8">
                  <Icon
                    name="BarChart3"
                    size={48}
                    className="mx-auto text-muted-foreground mb-4"
                  />
                  <p className="text-muted-foreground">
                    Раздел аналитики находится в разработке
                  </p>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="settings" className="space-y-6">
            <Card className="admin-card">
              <CardHeader>
                <CardTitle>Настройки системы</CardTitle>
                <CardDescription>
                  Управление параметрами админ панели
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="text-center py-8">
                  <Icon
                    name="Settings"
                    size={48}
                    className="mx-auto text-muted-foreground mb-4"
                  />
                  <p className="text-muted-foreground">
                    Раздел настроек находится в разработке
                  </p>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
};

export default Index;
