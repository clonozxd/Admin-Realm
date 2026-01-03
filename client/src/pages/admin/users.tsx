import { useState } from "react";
import { useQuery, useMutation } from "@tanstack/react-query";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import { Skeleton } from "@/components/ui/skeleton";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { useToast } from "@/hooks/use-toast";
import { queryClient, apiRequest } from "@/lib/queryClient";
import AdminLayout from "./layout";
import { createUserSchema, type CreateUserInput, type User } from "@shared/schema";
import { Plus, UserX, UserCheck, Users, Loader2, Shield, Edit } from "lucide-react";

export default function AdminUsers() {
  const { toast } = useToast();
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);
  const [editingUser, setEditingUser] = useState<User | null>(null);
  const [editName, setEditName] = useState("");
  const [editRole, setEditRole] = useState<"admin" | "student">("student");

  const { data: users = [], isLoading } = useQuery<User[]>({
    queryKey: ["/api/admin/users"],
  });

  const form = useForm<CreateUserInput>({
    resolver: zodResolver(createUserSchema),
    defaultValues: {
      name: "",
      email: "",
      password: "",
      role: "student",
    },
  });

  const createMutation = useMutation({
    mutationFn: async (data: CreateUserInput) => {
      await apiRequest("POST", "/api/admin/users", data);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/admin/users"] });
      setIsDialogOpen(false);
      form.reset();
      toast({ title: "Usuario creado", description: "El usuario ha sido creado exitosamente" });
    },
    onError: (error: Error) => {
      toast({ title: "Error", description: error.message || "No se pudo crear el usuario", variant: "destructive" });
    },
  });

  const blockMutation = useMutation({
    mutationFn: async ({ id, block }: { id: number; block: boolean }) => {
      await apiRequest("PATCH", `/api/admin/users/${id}/block`, { isBlocked: block });
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/admin/users"] });
      toast({ title: "Usuario actualizado", description: "El estado del usuario ha sido actualizado" });
    },
  });

  const updateUserMutation = useMutation({
    mutationFn: async ({ id, name, role }: { id: number; name: string; role: "admin" | "student" }) => {
      await apiRequest("PATCH", `/api/admin/users/${id}`, { name, role });
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/admin/users"] });
      setIsEditDialogOpen(false);
      setEditingUser(null);
      toast({ title: "Usuario actualizado", description: "Los datos del usuario han sido actualizados" });
    },
    onError: (error: Error) => {
      toast({ title: "Error", description: error.message || "No se pudo actualizar el usuario", variant: "destructive" });
    },
  });

  const onSubmit = (data: CreateUserInput) => {
    createMutation.mutate(data);
  };

  const handleEditUser = (user: User) => {
    setEditingUser(user);
    setEditName(user.name);
    setEditRole(user.role as "admin" | "student");
    setIsEditDialogOpen(true);
  };

  const handleSaveEdit = () => {
    if (editingUser && editName.trim().length >= 2) {
      updateUserMutation.mutate({
        id: editingUser.id,
        name: editName.trim(),
        role: editRole,
      });
    } else {
      toast({
        title: "Error",
        description: "El nombre debe tener al menos 2 caracteres",
        variant: "destructive",
      });
    }
  };

  return (
    <AdminLayout>
      <div className="space-y-6">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <h1 className="text-2xl font-bold">Gestión de Usuarios</h1>
            <p className="text-muted-foreground">Crear y administrar cuentas de usuarios</p>
          </div>
          <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
            <DialogTrigger asChild>
              <Button data-testid="button-create-user">
                <Plus className="h-4 w-4 mr-2" />
                Nuevo usuario
              </Button>
            </DialogTrigger>
            <DialogContent>
              <DialogHeader>
                <DialogTitle>Crear nuevo usuario</DialogTitle>
              </DialogHeader>
              <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="name">Nombre completo</Label>
                  <Input id="name" {...form.register("name")} data-testid="input-name" />
                  {form.formState.errors.name && (
                    <p className="text-sm text-destructive">{form.formState.errors.name.message}</p>
                  )}
                </div>
                <div className="space-y-2">
                  <Label htmlFor="email">Correo electrónico</Label>
                  <Input id="email" type="email" {...form.register("email")} data-testid="input-email" />
                  {form.formState.errors.email && (
                    <p className="text-sm text-destructive">{form.formState.errors.email.message}</p>
                  )}
                </div>
                <div className="space-y-2">
                  <Label htmlFor="password">Contraseña</Label>
                  <Input id="password" type="password" {...form.register("password")} data-testid="input-password" />
                  {form.formState.errors.password && (
                    <p className="text-sm text-destructive">{form.formState.errors.password.message}</p>
                  )}
                </div>
                <div className="space-y-2">
                  <Label htmlFor="role">Rol</Label>
                  <Select
                    value={form.watch("role")}
                    onValueChange={(v) => form.setValue("role", v as "admin" | "student")}
                  >
                    <SelectTrigger data-testid="select-role">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="student">Estudiante</SelectItem>
                      <SelectItem value="admin">Administrador</SelectItem>
                    </SelectContent>
                  </Select>
                  <p className="text-xs text-muted-foreground">
                    Los administradores pueden crear otros usuarios y gestionar eventos
                  </p>
                </div>
                <Button type="submit" className="w-full" disabled={createMutation.isPending} data-testid="button-submit-user">
                  {createMutation.isPending && <Loader2 className="h-4 w-4 mr-2 animate-spin" />}
                  Crear usuario
                </Button>
              </form>
            </DialogContent>
          </Dialog>
        </div>

        <Dialog open={isEditDialogOpen} onOpenChange={setIsEditDialogOpen}>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Editar usuario</DialogTitle>
            </DialogHeader>
            <div className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="edit-name">Nombre completo</Label>
                <Input
                  id="edit-name"
                  value={editName}
                  onChange={(e) => setEditName(e.target.value)}
                  data-testid="input-edit-name"
                />
              </div>
              <div className="space-y-2">
                <Label>Correo electrónico</Label>
                <Input value={editingUser?.email || ""} disabled />
                <p className="text-xs text-muted-foreground">El correo electrónico no puede ser modificado</p>
              </div>
              <div className="space-y-2">
                <Label htmlFor="edit-role">Rol</Label>
                <Select value={editRole} onValueChange={(v) => setEditRole(v as "admin" | "student")}>
                  <SelectTrigger data-testid="select-edit-role">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="student">Estudiante</SelectItem>
                    <SelectItem value="admin">Administrador</SelectItem>
                  </SelectContent>
                </Select>
                <p className="text-xs text-muted-foreground">
                  Cambiar el rol afecta los permisos del usuario inmediatamente
                </p>
              </div>
              <Button
                onClick={handleSaveEdit}
                disabled={updateUserMutation.isPending}
                className="w-full"
                data-testid="button-save-edit"
              >
                {updateUserMutation.isPending && <Loader2 className="h-4 w-4 mr-2 animate-spin" />}
                Guardar cambios
              </Button>
            </div>
          </DialogContent>
        </Dialog>

        <Card>
          <CardContent className="p-0">
            {isLoading ? (
              <div className="p-6 space-y-4">
                {[1, 2, 3].map((i) => (
                  <Skeleton key={i} className="h-16 w-full" />
                ))}
              </div>
            ) : users.length === 0 ? (
              <div className="p-12 text-center text-muted-foreground">
                <Users className="h-12 w-12 mx-auto mb-3 opacity-50" />
                <p>No hay usuarios registrados</p>
              </div>
            ) : (
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Nombre</TableHead>
                    <TableHead>Correo</TableHead>
                    <TableHead>Rol</TableHead>
                    <TableHead>Estado</TableHead>
                    <TableHead className="text-right">Acciones</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {users.map((user) => (
                    <TableRow key={user.id} data-testid={`user-row-${user.id}`}>
                      <TableCell className="font-medium">{user.name}</TableCell>
                      <TableCell>{user.email}</TableCell>
                      <TableCell>
                        <Badge variant={user.role === "admin" ? "default" : "secondary"} className="gap-1">
                          {user.role === "admin" && <Shield className="h-3 w-3" />}
                          {user.role === "admin" ? "Admin" : "Estudiante"}
                        </Badge>
                      </TableCell>
                      <TableCell>
                        <Badge variant={user.isBlocked ? "destructive" : "outline"}>
                          {user.isBlocked ? "Bloqueado" : "Activo"}
                        </Badge>
                      </TableCell>
                      <TableCell className="text-right">
                        <div className="flex justify-end gap-2">
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => handleEditUser(user)}
                            data-testid={`button-edit-${user.id}`}
                          >
                            <Edit className="h-4 w-4 mr-1" />
                            Editar
                          </Button>
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => blockMutation.mutate({ id: user.id, block: !user.isBlocked })}
                            data-testid={`button-block-${user.id}`}
                          >
                            {user.isBlocked ? (
                              <>
                                <UserCheck className="h-4 w-4 mr-1" />
                                Desbloquear
                              </>
                            ) : (
                              <>
                                <UserX className="h-4 w-4 mr-1" />
                                Bloquear
                              </>
                            )}
                          </Button>
                        </div>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            )}
          </CardContent>
        </Card>
      </div>
    </AdminLayout>
  );
}
