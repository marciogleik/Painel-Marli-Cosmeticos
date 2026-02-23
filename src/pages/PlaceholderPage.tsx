const PlaceholderPage = ({ title }: { title: string }) => {
  return (
    <div className="flex flex-col h-full">
      <div className="px-6 py-4 border-b border-border shrink-0">
        <h1 className="text-xl font-display font-bold">{title}</h1>
      </div>
      <div className="flex-1 flex items-center justify-center">
        <div className="text-center">
          <div className="w-16 h-16 rounded-full bg-gold/10 flex items-center justify-center mx-auto mb-4">
            <span className="text-2xl">🚧</span>
          </div>
          <p className="text-muted-foreground text-sm">Em desenvolvimento</p>
          <p className="text-xs text-muted-foreground/60 mt-1">Esta funcionalidade estará disponível em breve.</p>
        </div>
      </div>
    </div>
  );
};

export default PlaceholderPage;
